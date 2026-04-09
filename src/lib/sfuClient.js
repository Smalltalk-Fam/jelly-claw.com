// Reusable SFU client for Jelly-Claw Group Call and Voice Room.
//
// Wraps a single RTCPeerConnection that talks to Cloudflare Realtime SFU via
// the signaling Worker's WebSocket proxy at signal.jelly-claw.com/{room|voice}/:id.
//
// Usage:
//
//   const client = new SFUClient({
//     wsUrl: "wss://signal.jelly-claw.com/room/abc?mode=video",
//     role: "participant",
//     name: "iqram",
//     avatar: "https://...",
//     mode: "video",
//   });
//
//   client.on("roster", (participants, audienceCount) => { ... });
//   client.on("peer-joined", (peer) => { ... });
//   client.on("peer-left", (peerId) => { ... });
//   client.on("peer-state", (peerId, state) => { ... });
//   client.on("remote-track", (peerId, track, stream) => { ... });
//   client.on("chat", (message) => { ... });
//   client.on("hello-ack", (ack) => { ... });
//   client.on("error", (msg) => { ... });
//
//   await client.connect();               // opens WS, sends hello, creates session
//   await client.publishMedia(localStream); // participants only
//   // subscribes to the current roster happen automatically after hello-ack
//
//   client.sendChat("hello", 0);
//   client.setMuted(true);
//   client.setCameraOff(false);
//   client.leave();

const ICE_SERVERS = [
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun.l.google.com:19302" },
];

export class SFUClient {
  /**
   * @param {object} opts
   * @param {string} opts.wsUrl — full wss://… URL with ?mode=video|voice
   * @param {"participant"|"audience"} opts.role
   * @param {string} opts.name
   * @param {string} opts.avatar
   * @param {"video"|"voice"} opts.mode
   */
  constructor(opts) {
    this.wsUrl = opts.wsUrl;
    this.role = opts.role;
    this.name = opts.name || "anonymous";
    this.avatar = opts.avatar || "";
    this.mode = opts.mode;

    /** @type {WebSocket | null} */
    this.ws = null;
    /** @type {RTCPeerConnection | null} */
    this.pc = null;
    this.sessionId = null;
    this.peerId = null;
    this.roster = [];
    this.audienceCount = 0;
    /** peerId → MediaStream */
    this.remoteStreams = new Map();
    /** remote trackName → peerId (for ontrack routing) */
    this.trackNameToPeer = new Map();

    /** @type {Map<string, Function[]>} */
    this.listeners = new Map();
    this.keepAliveTimer = null;
    this.closed = false;
  }

  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(cb);
  }

  emit(event, ...args) {
    const list = this.listeners.get(event);
    if (!list) return;
    for (const cb of list) {
      try { cb(...args); } catch (e) { console.error(`[SFUClient] listener for '${event}' threw`, e); }
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────

  async connect() {
    // Preflight — verify the signaling server has SFU secrets set.
    // Without this, the WebSocket upgrade fails with a generic event
    // that gives no hint about what actually went wrong.
    try {
      const base = this.wsUrl.replace(/^wss?:/, location.protocol === "https:" ? "https:" : "http:").replace(/\/(room|voice|call)\/.*$/, "");
      const resp = await fetch(`${base}/health`, { mode: "cors" });
      const health = await resp.json();
      if (health.sfu !== "configured") {
        const err = new Error("SFU_NOT_CONFIGURED");
        err.code = "SFU_NOT_CONFIGURED";
        throw err;
      }
    } catch (e) {
      if (e?.code === "SFU_NOT_CONFIGURED") throw e;
      // network error on health check — fall through and let the WS try anyway
    }
    await this._openWebSocket();
    await this._sendHello();
    await this._bootstrapSession();
  }

  async leave() {
    if (this.closed) return;
    this.closed = true;
    this._stopKeepAlive();
    try { this._send({ type: "leave" }); } catch {}
    try { this.pc?.close(); } catch {}
    try { this.ws?.close(); } catch {}
    this.pc = null;
    this.ws = null;
  }

  // ── Internals ────────────────────────────────────────────────────

  _openWebSocket() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;

      ws.addEventListener("open", () => {
        this._startKeepAlive();
        resolve();
      });
      ws.addEventListener("error", (e) => {
        this.emit("error", "WebSocket error");
        reject(e);
      });
      ws.addEventListener("close", () => {
        this._stopKeepAlive();
        this.emit("closed");
      });
      ws.addEventListener("message", (ev) => {
        this._handleMessage(ev.data);
      });
    });
  }

  _send(msg) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(msg));
  }

  _startKeepAlive() {
    this._stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      this._send({ type: "ping" });
    }, 15000);
  }

  _stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  _sendHello() {
    this._send({
      type: "hello",
      role: this.role,
      name: this.name,
      avatar: this.avatar,
    });
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("hello-ack timeout")), 5000);
      this.on("hello-ack", (ack) => {
        clearTimeout(timeout);
        this.peerId = ack.peerId;
        this.roster = ack.roster || [];
        this.audienceCount = ack.audienceCount || 0;
        resolve(ack);
      });
    });
  }

  /**
   * Create the peer connection and hand the SFU a "session offer" so we get
   * a session id. Participants will then publish local media via
   * `publishMedia()`. Audience members skip media publishing and move
   * straight to subscribing.
   */
  async _bootstrapSession() {
    this.pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      bundlePolicy: "max-bundle",
    });

    this.pc.addEventListener("track", (event) => {
      const track = event.track;
      const stream = event.streams[0];
      // We don't always know the peerId yet — fall back to a best-effort by
      // trackName via ontrack's `transceiver.mid`.
      const mid = event.transceiver?.mid;
      let peerId = null;
      // Try to match by track name via SDP mid → peerId map we build during
      // subscribe calls.
      if (mid) {
        // trackNameToPeer is keyed by trackName; browsers don't always expose
        // the remote track name easily, so as a fallback use the stream id.
      }
      if (!peerId && stream) {
        // The server assigns stream ids like `{peerId}-audio` and `{peerId}-video`
        // via our trackName convention. Browsers use the track's `id` as the
        // stream id when there's a single track per transceiver — check both.
        const hint = stream.id || track.id;
        for (const p of this.roster) {
          if (
            p.tracks?.audio?.trackName === hint ||
            p.tracks?.video?.trackName === hint ||
            hint?.startsWith(p.peerId)
          ) {
            peerId = p.peerId;
            break;
          }
        }
      }

      if (peerId) {
        let ms = this.remoteStreams.get(peerId);
        if (!ms) {
          ms = new MediaStream();
          this.remoteStreams.set(peerId, ms);
        }
        ms.addTrack(track);
        this.emit("remote-track", peerId, track, ms);
      } else {
        // We got a track we can't attribute yet. Buffer it on a generic stream
        // and re-emit when subscribe completes.
        this.emit("remote-track", null, track, stream);
      }
    });

    // Build the initial offer. For participants with no addTransceiver calls
    // yet, this is an empty offer (just ICE params). Once publishMedia is
    // called, renegotiation will happen via the tracks/new flow.
    // For now we add a dummy recvonly audio transceiver so the SDP is valid.
    this.pc.addTransceiver("audio", { direction: "recvonly" });
    if (this.mode === "video") {
      this.pc.addTransceiver("video", { direction: "recvonly" });
    }

    // For participants, we defer session creation until publishMedia(); for
    // audience, we create the session immediately so they can subscribe.
    if (this.role === "audience") {
      await this._createSfuSession(this.pc.localDescription || await this._makeOffer());
      // Wait for the PeerConnection to fully connect before subscribing —
      // Cloudflare Realtime refuses tracks/new calls on "unready" sessions.
      await this._waitForConnection();
      await this._subscribeToRoster();
    }
  }

  _waitForConnection(timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      if (!this.pc) { reject(new Error("no peer connection")); return; }
      if (this.pc.connectionState === "connected") { resolve(); return; }
      const timer = setTimeout(() => {
        this.pc?.removeEventListener("connectionstatechange", handler);
        reject(new Error(`PeerConnection did not connect in ${timeoutMs}ms (state=${this.pc?.connectionState})`));
      }, timeoutMs);
      const handler = () => {
        const s = this.pc?.connectionState;
        if (s === "connected") {
          clearTimeout(timer);
          this.pc.removeEventListener("connectionstatechange", handler);
          resolve();
        } else if (s === "failed" || s === "closed") {
          clearTimeout(timer);
          this.pc.removeEventListener("connectionstatechange", handler);
          reject(new Error(`PeerConnection ${s}`));
        }
      };
      this.pc.addEventListener("connectionstatechange", handler);
    });
  }

  async _makeOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return this.pc.localDescription;
  }

  async _createSfuSession(offer) {
    this._send({ type: "sfu-publish", offer: { sdp: offer.sdp } });
    const result = await this._waitForMessage("sfu-publish-result");
    this.sessionId = result.sessionId;
    await this.pc.setRemoteDescription({ type: "answer", sdp: result.answer.sdp });
    return result;
  }

  /**
   * Participant only: publish the local mic (and camera if video mode).
   * Must be called AFTER `connect()` resolves.
   *
   * @param {MediaStream} localStream
   */
  async publishMedia(localStream) {
    if (this.role !== "participant") {
      throw new Error("publishMedia is only valid for participant role");
    }
    if (!this.pc) throw new Error("SFUClient not connected");

    // Replace the placeholder recvonly transceivers with sendonly tracks.
    // Add audio (always) and video (video mode only).
    const audioTrack = localStream.getAudioTracks()[0];
    const videoTrack = this.mode === "video" ? localStream.getVideoTracks()[0] : null;

    // Find our dummy transceivers from bootstrap and replace direction/track.
    const transceivers = this.pc.getTransceivers();
    const audioTx = transceivers.find((t) => t.receiver?.track?.kind === "audio");
    const videoTx = transceivers.find((t) => t.receiver?.track?.kind === "video");

    if (audioTx && audioTrack) {
      await audioTx.sender.replaceTrack(audioTrack);
      audioTx.direction = "sendonly";
    } else if (audioTrack) {
      this.pc.addTransceiver(audioTrack, { direction: "sendonly" });
    }

    if (this.mode === "video") {
      if (videoTx && videoTrack) {
        await videoTx.sender.replaceTrack(videoTrack);
        videoTx.direction = "sendonly";
      } else if (videoTrack) {
        this.pc.addTransceiver(videoTrack, { direction: "sendonly" });
      }
    }

    const offer = await this._makeOffer();
    await this._createSfuSession(offer);

    // Cloudflare Realtime needs pc.connectionState === "connected" before
    // tracks/new is legal. The initial offer published the sendonly
    // transceivers as part of sessions/new; we just need to name them.
    await this._waitForConnection();

    // Tell the server to register the track names with the SFU. No SDP
    // renegotiation is required — we're just naming the existing mids.
    this._send({ type: "sfu-register-tracks" });
    await this._waitForMessage("sfu-tracks-registered");

    await this._subscribeToRoster();
  }

  async _subscribeToRoster() {
    for (const peer of this.roster) {
      if (peer.peerId === this.peerId) continue;
      if (!peer.sessionId) continue;
      await this._subscribeTo(peer.peerId).catch((e) => {
        console.error("[SFUClient] subscribe failed for", peer.peerId, e);
      });
    }
  }

  async _subscribeTo(fromPeerId) {
    this._send({ type: "sfu-subscribe", fromPeerId });
    const result = await this._waitForMessage("sfu-subscribe-result", (m) => m.fromPeerId === fromPeerId);
    // The SFU gave us an offer to apply + renegotiate.
    await this.pc.setRemoteDescription({ type: "offer", sdp: result.offer.sdp });
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    if (result.requiresImmediateRenegotiation) {
      this._send({ type: "sfu-renegotiate", answer: { sdp: answer.sdp } });
      await this._waitForMessage("sfu-renegotiate-result");
    }
    // Remember which peer those trackNames belong to so ontrack can attribute.
    if (result.tracks) {
      for (const t of result.tracks) {
        this.trackNameToPeer.set(t.trackName, fromPeerId);
      }
    }
  }

  // ── Incoming message router ──────────────────────────────────────

  _pendingMatches = [];

  _handleMessage(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    // Resolve any pending waitForMessage promises — either matching the
    // requested type, or a server error that we should turn into a reject.
    for (let i = this._pendingMatches.length - 1; i >= 0; i--) {
      const p = this._pendingMatches[i];
      if (msg.type === p.type && (!p.predicate || p.predicate(msg))) {
        this._pendingMatches.splice(i, 1);
        p.resolve(msg);
      } else if (msg.type === "error") {
        // Any server error aborts every pending waiter so the user sees
        // the real reason instead of a generic 15-second timeout.
        this._pendingMatches.splice(i, 1);
        const err = new Error(msg.message || "server error");
        err.serverError = true;
        p.reject(err);
      }
    }

    switch (msg.type) {
      case "hello-ack":
        this.emit("hello-ack", msg);
        break;
      case "roster":
        this.roster = msg.participants || [];
        this.audienceCount = msg.audienceCount || 0;
        this.emit("roster", this.roster, this.audienceCount);
        break;
      case "peer-joined":
        if (msg.peer?.peerId && msg.peer.peerId !== this.peerId) {
          // New publisher — we need to subscribe to them.
          this.roster = [...this.roster.filter((p) => p.peerId !== msg.peer.peerId), msg.peer];
          this.emit("peer-joined", msg.peer);
          this._subscribeTo(msg.peer.peerId).catch((e) => console.error(e));
        }
        break;
      case "peer-left":
        this.roster = this.roster.filter((p) => p.peerId !== msg.peerId);
        this.remoteStreams.delete(msg.peerId);
        this.emit("peer-left", msg.peerId);
        break;
      case "peer-state":
        this.emit("peer-state", msg.peerId, {
          muted: msg.muted,
          cameraOff: msg.cameraOff,
        });
        break;
      case "chat":
        this.emit("chat", msg.message);
        break;
      case "room-full":
        this.emit("error", "room-full");
        break;
      case "room-mode-mismatch":
        this.emit("error", "room-mode-mismatch");
        break;
      case "room-closed":
        this.emit("error", `room-closed: ${msg.reason}`);
        break;
      case "error":
        this.emit("error", msg.message);
        break;
      case "pong":
        break;
    }
  }

  _waitForMessage(type, predicate) {
    return new Promise((resolve, reject) => {
      const entry = {};
      const timeout = setTimeout(() => {
        const i = this._pendingMatches.indexOf(entry);
        if (i >= 0) this._pendingMatches.splice(i, 1);
        reject(new Error(`timed out waiting for ${type}`));
      }, 15000);
      entry.type = type;
      entry.predicate = predicate;
      entry.resolve = (msg) => { clearTimeout(timeout); resolve(msg); };
      entry.reject = (err) => { clearTimeout(timeout); reject(err); };
      this._pendingMatches.push(entry);
    });
  }

  // ── Public controls ──────────────────────────────────────────────

  sendChat(content, tip = 0) {
    this._send({ type: "chat", content, tip });
  }

  setMuted(muted) {
    this._send({ type: "state-change", muted });
    if (this.pc) {
      for (const t of this.pc.getTransceivers()) {
        if (t.sender?.track?.kind === "audio") {
          t.sender.track.enabled = !muted;
        }
      }
    }
  }

  setCameraOff(cameraOff) {
    this._send({ type: "state-change", cameraOff });
    if (this.pc) {
      for (const t of this.pc.getTransceivers()) {
        if (t.sender?.track?.kind === "video") {
          t.sender.track.enabled = !cameraOff;
        }
      }
    }
  }
}

// Generate a stable anonymous nickname/avatar for spectators who aren't
// signed in. Stored in localStorage.
export function anonymousIdentity() {
  if (typeof localStorage === "undefined") {
    return { name: "anonymous", avatar: "" };
  }
  let name = localStorage.getItem("jc_anon_name");
  if (!name) {
    const adjectives = ["silver", "velvet", "ember", "ivory", "obsidian", "amber", "cobalt", "pearl"];
    const nouns = ["fish", "wren", "fox", "orca", "lynx", "moth", "heron", "stag"];
    name =
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      "-" +
      nouns[Math.floor(Math.random() * nouns.length)];
    localStorage.setItem("jc_anon_name", name);
  }
  const avatar = localStorage.getItem("jc_anon_avatar") || "";
  return { name, avatar };
}

export function signalingUrl(path) {
  // In dev, fall back to localhost if the dev flag is set.
  if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    return `ws://localhost:8787${path}`;
  }
  return `wss://signal.jelly-claw.com${path}`;
}

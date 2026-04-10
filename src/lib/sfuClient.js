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
    /** transceiver mid → peerId, populated before each subscribe setRemoteDescription */
    this.midToPeerId = new Map();
    /** Set of peerIds we have successfully subscribed to */
    this.subscribedPeers = new Set();
    /** Tracks that arrived before we could attribute them to a peer */
    this.unattributedTracks = [];

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
        // Emit roster so the UI gets the initial participant list immediately
        this.emit("roster", this.roster, this.audienceCount);
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
      const mid = event.transceiver?.mid;
      console.log("[SFUClient] ontrack kind=", track.kind, "mid=", mid, "streamId=", stream?.id);

      const peerId = this._attributeTrack(mid, stream, track);
      if (peerId) {
        this._deliverTrack(peerId, track);
      } else {
        // Queue for later — subscribe hasn't mapped the mids yet
        console.log("[SFUClient] ontrack queued (no peer yet) mid=", mid);
        this.unattributedTracks.push({ track, stream, mid });
      }
    });

    // Build the initial offer. Add dummy recvonly transceivers so the SDP is valid.
    this.pc.addTransceiver("audio", { direction: "recvonly" });
    if (this.mode === "video") {
      this.pc.addTransceiver("video", { direction: "recvonly" });
    }

    // For participants, we defer session creation until publishMedia(); for
    // audience, we create the session then subscribe to all publishers.
    if (this.role === "audience") {
      const offer = await this._makeOffer();
      await this._createSfuSession(offer);
      // Give ICE a moment to settle. If it doesn't, proceed — sweeps will retry.
      await this._waitForConnection(5000).catch(() => {
        console.warn("[SFUClient] audience ICE didn't connect in 5s, proceeding anyway");
      });
      await this._subscribeToRoster();
    }
  }

  _attributeTrack(mid, stream, track) {
    // 1. Mid map (populated by _subscribeTo)
    let peerId = mid != null ? (this.midToPeerId.get(String(mid)) ?? null) : null;

    // 2. Track name / stream ID fallback
    if (!peerId && stream) {
      const hint = stream.id || track.id;
      for (const p of this.roster) {
        if (
          p.tracks?.audio?.trackName === hint ||
          p.tracks?.video?.trackName === hint ||
          (hint && hint.startsWith(p.peerId))
        ) {
          peerId = p.peerId;
          break;
        }
      }
    }

    // 3. If only one other person in roster, all tracks must be theirs.
    //    Don't require sessionId — it may not be set yet during publish.
    if (!peerId) {
      const others = this.roster.filter((p) => p.peerId !== this.peerId);
      if (others.length === 1) {
        peerId = others[0].peerId;
      }
    }

    // 4. If we've subscribed to exactly one peer, tracks belong to them
    if (!peerId && this.subscribedPeers.size === 1) {
      peerId = this.subscribedPeers.values().next().value;
    }

    return peerId;
  }

  _deliverTrack(peerId, track) {
    let ms = this.remoteStreams.get(peerId);
    if (!ms) {
      ms = new MediaStream();
      this.remoteStreams.set(peerId, ms);
    }
    if (!ms.getTracks().some((t) => t.id === track.id)) {
      ms.addTrack(track);
    }
    this.emit("remote-track", peerId, track, ms);
  }

  /** Try to deliver any queued tracks that arrived before mid mapping was ready */
  _flushUnattributedTracks() {
    const remaining = [];
    for (const entry of this.unattributedTracks) {
      const peerId = this._attributeTrack(entry.mid, entry.stream, entry.track);
      if (peerId) {
        console.log("[SFUClient] flushed queued track to", peerId, "kind=", entry.track.kind);
        this._deliverTrack(peerId, entry.track);
      } else {
        remaining.push(entry);
      }
    }
    this.unattributedTracks = remaining;
  }

  _waitForConnection(timeoutMs = 20000) {
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
    // Cloudflare Realtime SFU is ice-lite and does not support trickle ICE.
    // Wait for iceGatheringState === "complete" so the SDP we send contains
    // every candidate — otherwise the remote end can't finish the handshake
    // and our connectionstate never reaches "connected".
    await this._waitForIceGathering(2500);
    return this.pc.localDescription;
  }

  _waitForIceGathering(timeoutMs = 2500) {
    return new Promise((resolve) => {
      if (!this.pc || this.pc.iceGatheringState === "complete") {
        resolve();
        return;
      }
      const cleanup = () => {
        this.pc?.removeEventListener("icegatheringstatechange", check);
        clearTimeout(timer);
        resolve();
      };
      const check = () => {
        if (this.pc?.iceGatheringState === "complete") cleanup();
      };
      const timer = setTimeout(cleanup, timeoutMs);
      this.pc.addEventListener("icegatheringstatechange", check);
    });
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
    console.log("[SFUClient] _subscribeToRoster: roster has", this.roster.length, "peers, sessionId=", this.sessionId);
    for (const peer of this.roster) {
      if (peer.peerId === this.peerId) continue;
      if (this.subscribedPeers.has(peer.peerId)) continue;
      if (!peer.sessionId) {
        console.log("[SFUClient] skipping peer", peer.peerId, "— no sessionId yet");
        continue;
      }
      console.log("[SFUClient] subscribing to", peer.peerId, "name=", peer.name, "sessionId=", peer.sessionId);
      try {
        await this._subscribeTo(peer.peerId);
        this.subscribedPeers.add(peer.peerId);
        this._flushUnattributedTracks();
        console.log("[SFUClient] subscribed to", peer.peerId, "OK");
      } catch (e) {
        console.warn("[SFUClient] subscribe failed for", peer.peerId, e?.message);
      }
    }
    // Schedule a sweep to catch any peers we missed (tracks not registered
    // yet, late joiners during the loop, transient errors). Runs 3 times
    // at increasing intervals.
    this._scheduleSubscribeSweep();
  }

  _subscribeSweepCount = 0;

  _scheduleSubscribeSweep() {
    if (this._subscribeSweepCount >= 3) return;
    const delay = [2000, 5000, 10000][this._subscribeSweepCount] || 10000;
    this._subscribeSweepCount++;
    setTimeout(async () => {
      if (this.closed) return;
      let subscribed = 0;
      for (const peer of this.roster) {
        if (peer.peerId === this.peerId) continue;
        if (!peer.sessionId) continue;
        if (this.subscribedPeers.has(peer.peerId)) continue;
        try {
          await this._subscribeTo(peer.peerId);
          this.subscribedPeers.add(peer.peerId);
          subscribed++;
        } catch (e) {
          console.warn("[SFUClient] sweep subscribe failed for", peer.peerId, e?.message);
        }
      }
      if (subscribed > 0) {
        console.log(`[SFUClient] sweep #${this._subscribeSweepCount} subscribed to ${subscribed} new peers`);
        this._flushUnattributedTracks();
      }
      // Also flush even if no new subscribes — roster may have updated
      this._flushUnattributedTracks();
      // Keep sweeping if there are still unsubscribed peers
      const unsubscribed = this.roster.filter(
        (p) => p.peerId !== this.peerId && p.sessionId && !this.subscribedPeers.has(p.peerId)
      );
      if (unsubscribed.length > 0) {
        this._scheduleSubscribeSweep();
      }
    }, delay);
  }

  async _subscribeTo(fromPeerId) {
    this._send({ type: "sfu-subscribe", fromPeerId });
    const result = await this._waitForMessage("sfu-subscribe-result", (m) => m.fromPeerId === fromPeerId);

    // Parse mid values out of the SFU's offer SDP and attribute any mid
    // that doesn't already have a peer mapping to `fromPeerId`. This must
    // happen BEFORE setRemoteDescription because ontrack fires synchronously
    // inside that call and we need the lookup ready by then.
    //
    // NOTE: We do NOT filter by existingMids — the SFU may reuse the initial
    // recvonly transceivers (mid 0, 1) for the first subscription instead of
    // adding new m-lines. Those mids need to be mapped too.
    const midMatches = [...result.offer.sdp.matchAll(/^a=mid:(\S+)/gm)];
    const mapped = [];
    for (const m of midMatches) {
      const mid = m[1];
      if (!this.midToPeerId.has(mid)) {
        this.midToPeerId.set(mid, fromPeerId);
        mapped.push(mid);
      }
    }
    console.log("[SFUClient] subscribe to", fromPeerId, "mapped mids:", mapped);

    // Now apply the offer — ontrack will fire with transceivers whose mids
    // are in midToPeerId.
    await this.pc.setRemoteDescription({ type: "offer", sdp: result.offer.sdp });
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    // Always send the answer back to the SFU after applying a subscribe offer.
    // Some Cloudflare Realtime sessions need this even when
    // requiresImmediateRenegotiation is false — without it, tracks don't flow.
    this._send({ type: "sfu-renegotiate", answer: { sdp: answer.sdp } });
    try {
      await this._waitForMessage("sfu-renegotiate-result");
    } catch (e) {
      // Non-fatal — tracks may still flow even if renegotiate "fails"
      console.warn("[SFUClient] renegotiate after subscribe:", e?.message);
    }

    // Also remember trackNames → peerId for any late fallback lookups.
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

    // Resolve any pending waitForMessage promises.
    // Server errors only reject the OLDEST pending waiter (not all of them),
    // so one failed subscribe doesn't cascade and kill unrelated operations.
    for (let i = this._pendingMatches.length - 1; i >= 0; i--) {
      const p = this._pendingMatches[i];
      if (msg.type === p.type && (!p.predicate || p.predicate(msg))) {
        this._pendingMatches.splice(i, 1);
        p.resolve(msg);
        return; // matched — don't fall through to the switch
      }
    }
    if (msg.type === "error" && this._pendingMatches.length > 0) {
      const p = this._pendingMatches.shift();
      const err = new Error(msg.message || "server error");
      err.serverError = true;
      p.reject(err);
    }

    switch (msg.type) {
      case "hello-ack":
        this.emit("hello-ack", msg);
        break;
      case "roster":
        this.roster = msg.participants || [];
        this.audienceCount = msg.audienceCount || 0;
        this.emit("roster", this.roster, this.audienceCount);
        // Check if any new peers need subscribing
        if (this.sessionId) {
          const unsubscribed = this.roster.filter(
            (p) => p.peerId !== this.peerId && p.sessionId && !this.subscribedPeers.has(p.peerId)
          );
          if (unsubscribed.length > 0) {
            // Reset sweep counter so we get fresh retries
            this._subscribeSweepCount = 0;
            this._scheduleSubscribeSweep();
          }
        }
        break;
      case "peer-joined":
        if (msg.peer?.peerId && msg.peer.peerId !== this.peerId) {
          this.roster = [...this.roster.filter((p) => p.peerId !== msg.peer.peerId), msg.peer];
          this.emit("peer-joined", msg.peer);
          // Auto-subscribe if we have a session and haven't subscribed yet
          if (this.sessionId && msg.peer.sessionId && !this.subscribedPeers.has(msg.peer.peerId)) {
            this._subscribeTo(msg.peer.peerId).then(() => {
              this.subscribedPeers.add(msg.peer.peerId);
              this._flushUnattributedTracks();
              console.log("[SFUClient] auto-subscribed to new peer", msg.peer.peerId);
            }).catch((e) => {
              console.warn("[SFUClient] auto-subscribe to new peer failed:", e?.message);
              // Will be picked up by the sweep
            });
          }
        }
        break;
      case "peer-left":
        this.roster = this.roster.filter((p) => p.peerId !== msg.peerId);
        this.remoteStreams.delete(msg.peerId);
        this.subscribedPeers.delete(msg.peerId);
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

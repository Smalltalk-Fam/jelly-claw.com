<script>
  import { onMount, onDestroy } from 'svelte';
  import { SFUClient, anonymousIdentity, signalingUrl } from '$lib/sfuClient.js';

  let { data } = $props();
  const roomId = data.roomId;

  // ── State ─────────────────────────────────────────────────────
  let client = $state(null);
  let roster = $state([]);                    // Participant[]
  let remoteStreams = $state(new Map());      // peerId → MediaStream
  let peerStates = $state(new Map());         // peerId → { muted, cameraOff }
  let localStream = $state(null);
  let selfPeerId = $state(null);
  let audienceCount = $state(0);
  let muted = $state(false);
  let cameraOff = $state(false);
  let chatMessages = $state([]);
  let chatInput = $state('');
  let isChatOpen = $state(false);
  let status = $state('connecting');          // connecting | waiting | live | ended | error
  let errorText = $state('');
  let copiedTooltip = $state('');

  const participantLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}` : '';
  const watchLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}/watch` : '';

  // Derived: tiles to render in the grid (roster + self)
  const tiles = $derived.by(() => {
    const list = [];
    // self first
    if (localStream) {
      list.push({
        peerId: 'self',
        name: 'you',
        avatar: '',
        stream: localStream,
        isSelf: true,
        muted,
        cameraOff,
      });
    }
    for (const p of roster) {
      if (p.peerId === selfPeerId) continue;
      const ps = peerStates.get(p.peerId) || {};
      list.push({
        peerId: p.peerId,
        name: p.name,
        avatar: p.avatar,
        stream: remoteStreams.get(p.peerId) ?? null,
        isSelf: false,
        muted: ps.muted === true,
        cameraOff: ps.cameraOff === true,
      });
    }
    return list;
  });

  // Grid layout class based on tile count
  const gridClass = $derived.by(() => {
    const n = tiles.length;
    if (n <= 1) return 'grid-1';
    if (n === 2) return 'grid-2';
    if (n <= 4) return 'grid-4';
    if (n <= 6) return 'grid-6';
    return 'grid-8';
  });

  onMount(async () => {
    try {
      const identity = anonymousIdentity();
      client = new SFUClient({
        wsUrl: signalingUrl(`/room/${roomId}?mode=video`),
        role: 'participant',
        name: identity.name,
        avatar: identity.avatar,
        mode: 'video',
      });

      client.on('hello-ack', (ack) => {
        selfPeerId = ack.peerId;
      });
      client.on('roster', (participants, audCount) => {
        roster = participants;
        audienceCount = audCount;
      });
      client.on('peer-joined', (peer) => {
        // roster event will follow — nothing extra needed
      });
      client.on('peer-left', (peerId) => {
        const next = new Map(remoteStreams);
        next.delete(peerId);
        remoteStreams = next;
      });
      client.on('peer-state', (peerId, state) => {
        const next = new Map(peerStates);
        next.set(peerId, state);
        peerStates = next;
      });
      client.on('remote-track', (peerId, track, stream) => {
        if (!peerId) return;
        const next = new Map(remoteStreams);
        let ms = next.get(peerId);
        if (!ms) {
          ms = new MediaStream();
        }
        if (!ms.getTracks().some((t) => t.id === track.id)) {
          ms.addTrack(track);
        }
        next.set(peerId, ms);
        remoteStreams = next;
      });
      client.on('chat', (msg) => {
        chatMessages = [...chatMessages, msg];
      });
      client.on('error', (msg) => {
        console.error('[SFU]', msg);
        if (msg === 'room-full') {
          errorText = "This call is full (8/8). Watch as a spectator instead.";
          status = 'error';
        } else if (status !== 'live') {
          errorText = msg;
          status = 'error';
        }
      });

      await client.connect();

      // Get mic + camera
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      });

      await client.publishMedia(localStream);
      status = 'live';
    } catch (err) {
      console.error(err);
      if (err?.code === 'SFU_NOT_CONFIGURED' || err?.message === 'SFU_NOT_CONFIGURED') {
        errorText = 'SFU_NOT_CONFIGURED';
      } else {
        errorText = err?.message || 'Failed to join call';
      }
      status = 'error';
    }
  });

  onDestroy(() => {
    client?.leave();
    if (localStream) {
      for (const t of localStream.getTracks()) t.stop();
    }
  });

  function toggleMute() {
    muted = !muted;
    client?.setMuted(muted);
  }

  function toggleCamera() {
    cameraOff = !cameraOff;
    client?.setCameraOff(cameraOff);
  }

  function endCall() {
    client?.leave();
    if (typeof window !== 'undefined') {
      window.close();
      // If window.close is blocked, navigate home
      setTimeout(() => (window.location.href = '/'), 100);
    }
  }

  async function copyLink(link, label) {
    try {
      await navigator.clipboard.writeText(link);
      copiedTooltip = `${label} copied`;
      setTimeout(() => (copiedTooltip = ''), 1800);
    } catch {}
  }

  function sendChat() {
    const content = chatInput.trim();
    if (!content) return;
    client?.sendChat(content, 0);
    chatInput = '';
  }

  function onChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  }

  // Attach remote streams to video elements — Svelte 5 action
  function bindStream(node, stream) {
    node.srcObject = stream;
    return {
      update(next) {
        if (node.srcObject !== next) node.srcObject = next;
      },
    };
  }
</script>

<svelte:head>
  <title>Group Call · Jelly-Claw</title>
</svelte:head>

<div class="page">
  <!-- Top bar -->
  <header class="topbar">
    <div class="brand">
      <span class="eyebrow">JELLY CLAW / LIVE</span>
      <span class="dot" class:pulse={status === 'live'}></span>
    </div>
    <div class="counts">
      <span>{tiles.length} HERE</span>
      <span class="sep">·</span>
      <span>{audienceCount} WATCHING</span>
    </div>
    <div class="topbar-actions">
      <button class="icon-btn" on:click={() => (isChatOpen = !isChatOpen)} title="chat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <button class="icon-btn danger" on:click={endCall} title="end call">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- Main area -->
  <main class="main" class:with-chat={isChatOpen}>
    <div class="stage">
      {#if status === 'error'}
        {#if errorText === 'SFU_NOT_CONFIGURED'}
          <div class="error-box">
            <p class="eyebrow">CLOUDFLARE REALTIME NOT SET UP</p>
            <p>Group Call and Voice Room need Cloudflare Realtime SFU secrets on the signaling server. Run these, then reload:</p>
            <pre class="setup-code">wrangler secret put CALLS_APP_ID
wrangler secret put CALLS_APP_TOKEN
wrangler deploy</pre>
            <p style="font-size: 0.72rem; opacity: 0.55;">Get them from Cloudflare dashboard → Realtime → SFU. 1:1 calls at /call/:id work without this.</p>
          </div>
        {:else}
          <div class="error-box">
            <p class="eyebrow">SOMETHING WENT WRONG</p>
            <p>{errorText}</p>
            <a href="/room/{roomId}/watch" class="btn-outline">WATCH INSTEAD</a>
          </div>
        {/if}
      {:else if status === 'connecting'}
        <div class="connecting-box">
          <p class="eyebrow">CONNECTING</p>
          <p>Allow mic + camera to join the call.</p>
        </div>
      {:else}
        <div class="grid {gridClass}">
          {#each tiles as tile (tile.peerId)}
            <div class="tile" class:self={tile.isSelf}>
              {#if tile.stream && !tile.cameraOff}
                <video
                  use:bindStream={tile.stream}
                  autoplay
                  playsinline
                  muted={tile.isSelf}
                ></video>
              {:else}
                <div class="avatar-placeholder">
                  {#if tile.avatar}
                    <img src={tile.avatar} alt={tile.name} />
                  {:else}
                    <span>{tile.name.slice(0, 1).toUpperCase()}</span>
                  {/if}
                </div>
              {/if}
              <div class="tile-label">
                {#if tile.muted}
                  <svg class="mute-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 1l22 22"/>
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                  </svg>
                {/if}
                <span>{tile.name}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if isChatOpen}
      <aside class="chat">
        <div class="chat-header">
          <span class="eyebrow">CHAT</span>
          <span class="audience-badge">{audienceCount} watching</span>
        </div>
        <div class="chat-scroll">
          {#each chatMessages as msg (msg.id)}
            <div class="chat-msg" class:tip={msg.tip > 0}>
              <span class="chat-from">@{msg.from.name}</span>
              {#if msg.tip > 0}
                <span class="chat-tip">🪼 +{msg.tip}</span>
              {/if}
              <span class="chat-body">{msg.content}</span>
            </div>
          {/each}
        </div>
        <div class="chat-input">
          <input
            type="text"
            placeholder="say something"
            bind:value={chatInput}
            on:keydown={onChatKeydown}
          />
          <button on:click={sendChat}>SEND</button>
        </div>
      </aside>
    {/if}
  </main>

  <!-- Bottom controls -->
  <footer class="controls">
    <button class="ctrl" class:active={muted} on:click={toggleMute} title="mute">
      {#if muted}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M15 9.34V4a3 3 0 0 0-5.94-.6"/></svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
      {/if}
    </button>

    <button class="ctrl" class:active={cameraOff} on:click={toggleCamera} title="camera">
      {#if cameraOff}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"/><path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/></svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
      {/if}
    </button>

    <div class="link-buttons">
      <button class="pill" on:click={() => copyLink(participantLink(), 'Participant link')}>
        COPY PARTICIPANT LINK
      </button>
      <button class="pill" on:click={() => copyLink(watchLink(), 'Watch link')}>
        COPY WATCH LINK
      </button>
    </div>

    <button class="ctrl end" on:click={endCall} title="end">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </button>
  </footer>

  {#if copiedTooltip}
    <div class="toast">{copiedTooltip}</div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    background: #070707;
    color: #f4f1ea;
    font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
  }

  .page {
    min-height: 100vh;
    background: #070707;
    color: #f4f1ea;
    display: flex;
    flex-direction: column;
  }

  /* Top bar */
  .topbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 14px 22px;
    border-bottom: 1px solid rgba(244, 241, 234, 0.08);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .eyebrow {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    color: rgba(244, 241, 234, 0.55);
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(234, 130, 56, 0.9);
  }
  .dot.pulse {
    animation: pulse 1.4s ease-out infinite;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(234, 130, 56, 0.6); }
    50% { box-shadow: 0 0 0 6px rgba(234, 130, 56, 0); }
  }
  .counts {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: rgba(244, 241, 234, 0.6);
    font-weight: 600;
  }
  .counts .sep {
    margin: 0 6px;
    color: rgba(244, 241, 234, 0.25);
  }
  .topbar-actions {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
  .icon-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(244, 241, 234, 0.05);
    border: 1px solid rgba(244, 241, 234, 0.12);
    color: rgba(244, 241, 234, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .icon-btn:hover { background: rgba(244, 241, 234, 0.1); }
  .icon-btn.danger:hover { background: rgba(234, 60, 56, 0.15); border-color: rgba(234, 60, 56, 0.4); color: #ea8238; }

  /* Main */
  .main {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    overflow: hidden;
  }
  .main.with-chat {
    grid-template-columns: 1fr 320px;
  }

  .stage {
    padding: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }

  .grid {
    display: grid;
    gap: 14px;
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 170px);
  }
  .grid-1 { grid-template-columns: 1fr; grid-template-rows: 1fr; }
  .grid-2 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; }
  .grid-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
  .grid-6 { grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; }
  .grid-8 { grid-template-columns: 1fr 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; }

  .tile {
    position: relative;
    background: #0f0f0f;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(244, 241, 234, 0.08);
    aspect-ratio: 4 / 3;
  }
  .tile video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.2) contrast(1.05);
  }
  .tile.self video { transform: scaleX(-1); }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #151515;
    font-family: 'Forum', serif;
    font-size: 4rem;
    color: rgba(244, 241, 234, 0.4);
  }
  .avatar-placeholder img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1);
  }

  .tile-label {
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 999px;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(244, 241, 234, 0.9);
    backdrop-filter: blur(8px);
  }
  .mute-icon { color: #ea8238; }

  /* Error / connecting states */
  .error-box, .connecting-box {
    text-align: center;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(244, 241, 234, 0.08);
    background: rgba(244, 241, 234, 0.02);
    max-width: 400px;
  }
  .error-box p, .connecting-box p {
    font-size: 0.85rem;
    color: rgba(244, 241, 234, 0.7);
    margin: 0.4rem 0;
  }
  .btn-outline {
    display: inline-block;
    margin-top: 1rem;
    padding: 9px 18px;
    border: 1px solid rgba(244, 241, 234, 0.25);
    border-radius: 999px;
    color: #f4f1ea;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-decoration: none;
  }
  .setup-code {
    background: rgba(244, 241, 234, 0.05);
    border: 1px solid rgba(244, 241, 234, 0.12);
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 0.72rem;
    color: rgba(244, 241, 234, 0.85);
    text-align: left;
    overflow-x: auto;
    margin: 1rem 0;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    white-space: pre;
  }

  /* Chat */
  .chat {
    background: #0b0b0b;
    border-left: 1px solid rgba(244, 241, 234, 0.08);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .chat-header {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(244, 241, 234, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .audience-badge {
    font-size: 0.65rem;
    color: rgba(244, 241, 234, 0.4);
    letter-spacing: 0.1em;
  }
  .chat-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .chat-msg {
    font-size: 0.8rem;
    line-height: 1.4;
    color: rgba(244, 241, 234, 0.85);
  }
  .chat-msg.tip {
    background: linear-gradient(135deg, rgba(255, 180, 50, 0.14), rgba(234, 130, 56, 0.06));
    border: 1px solid rgba(255, 180, 50, 0.25);
    border-radius: 10px;
    padding: 6px 10px;
  }
  .chat-from {
    font-weight: 600;
    color: #ea8238;
    margin-right: 5px;
  }
  .chat-tip {
    color: #ffcc55;
    font-weight: 600;
    margin-right: 5px;
  }
  .chat-input {
    padding: 10px 12px;
    border-top: 1px solid rgba(244, 241, 234, 0.06);
    display: flex;
    gap: 6px;
  }
  .chat-input input {
    flex: 1;
    background: rgba(244, 241, 234, 0.05);
    border: 1px solid rgba(244, 241, 234, 0.1);
    border-radius: 8px;
    padding: 7px 10px;
    color: #f4f1ea;
    font-size: 0.75rem;
    outline: none;
  }
  .chat-input input:focus { border-color: rgba(56, 152, 236, 0.5); }
  .chat-input button {
    background: #f4f1ea;
    color: #070707;
    border: none;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
  }

  /* Controls */
  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 22px;
    border-top: 1px solid rgba(244, 241, 234, 0.08);
    background: #0a0a0a;
  }
  .ctrl {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(244, 241, 234, 0.06);
    border: 1px solid rgba(244, 241, 234, 0.12);
    color: #f4f1ea;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .ctrl:hover { background: rgba(244, 241, 234, 0.12); }
  .ctrl.active {
    background: rgba(234, 130, 56, 0.18);
    border-color: rgba(234, 130, 56, 0.5);
    color: #ea8238;
  }
  .ctrl.end {
    background: linear-gradient(135deg, #b53120, #ea8238);
    border-color: transparent;
    color: white;
    margin-left: auto;
  }
  .link-buttons {
    display: flex;
    gap: 8px;
    margin-left: 12px;
  }
  .pill {
    background: transparent;
    border: 1px solid rgba(244, 241, 234, 0.18);
    color: rgba(244, 241, 234, 0.85);
    padding: 9px 16px;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    cursor: pointer;
  }
  .pill:hover { background: rgba(244, 241, 234, 0.06); }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    background: #f4f1ea;
    color: #070707;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 720px) {
    .main.with-chat {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
    }
    .chat { border-left: none; border-top: 1px solid rgba(244, 241, 234, 0.08); max-height: 240px; }
    .link-buttons { display: none; }
  }
</style>

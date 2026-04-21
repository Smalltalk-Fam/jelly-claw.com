<script>
  import { onMount, onDestroy } from 'svelte';
  import { SFUClient, anonymousIdentity, signalingUrl } from '$lib/sfuClient.js';

  let { data } = $props();
  const roomId = data.roomId;

  let client = $state(null);
  let roster = $state([]);
  let remoteStreams = $state(new Map());
  let peerStates = $state(new Map());
  let audienceCount = $state(0);
  let chatMessages = $state([]);
  let chatInput = $state('');
  let selectedTip = $state(0);
  let status = $state('connecting');
  let errorText = $state('');

  const watchLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}/watch` : '';

  const roomFull = $derived(roster.length >= 8);
  const gridClass = $derived.by(() => {
    const n = roster.length;
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
        role: 'audience',
        name: identity.name,
        avatar: identity.avatar,
        mode: 'video',
      });

      client.on('roster', (participants, audCount) => {
        roster = participants;
        audienceCount = audCount;
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
        if (!ms) ms = new MediaStream();
        if (!ms.getTracks().some((t) => t.id === track.id)) ms.addTrack(track);
        next.set(peerId, ms);
        remoteStreams = next;
      });
      client.on('chat', (msg) => {
        chatMessages = [...chatMessages, msg];
      });
      client.on('error', (msg) => {
        if (status !== 'live') {
          errorText = msg;
          status = 'error';
        }
      });

      await client.connect();
      status = 'live';
    } catch (err) {
      if (err?.code === 'SFU_NOT_CONFIGURED' || err?.message === 'SFU_NOT_CONFIGURED') {
        errorText = 'SFU_NOT_CONFIGURED';
      } else {
        errorText = err?.message || 'Failed to join';
      }
      status = 'error';
    }
  });

  onDestroy(() => {
    client?.leave();
  });

  function sendChat() {
    const content = chatInput.trim();
    if (!content && selectedTip === 0) return;
    client?.sendChat(content || `tipped ${selectedTip}`, selectedTip);
    chatInput = '';
    selectedTip = 0;
  }

  function tip(amount) {
    selectedTip = selectedTip === amount ? 0 : amount;
  }

  function onChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  }

  async function copyWatchLink() {
    try {
      await navigator.clipboard.writeText(watchLink());
    } catch {}
  }

  function bindStream(node, stream) {
    node.srcObject = stream;
    node.play().catch(() => {});
    return { update(n) { if (node.srcObject !== n) { node.srcObject = n; node.play().catch(() => {}); } } };
  }
</script>

<svelte:head>
  <title>Watch · Jelly-Claw</title>
</svelte:head>

<div class="page">
  <header class="topbar">
    <div class="brand">
      <span class="eyebrow">JELLY CLAW / LIVE</span>
      <span class="dot" class:pulse={status === 'live'}></span>
    </div>
    <div class="counts">
      <span>{roster.length} HERE</span>
      <span class="sep">·</span>
      <span>{audienceCount} WATCHING</span>
    </div>
  </header>

  <main class="main">
    <div class="stage">
      {#if status === 'connecting'}
        <div class="box"><p class="eyebrow">CONNECTING</p></div>
      {:else if status === 'error' && errorText === 'SFU_NOT_CONFIGURED'}
        <div class="box">
          <p class="eyebrow">CLOUDFLARE REALTIME NOT SET UP</p>
          <p style="font-size: 0.8rem;">The signaling server needs Cloudflare Realtime SFU secrets. Run:</p>
          <pre style="background: rgba(244,241,234,0.05); border: 1px solid rgba(244,241,234,0.12); padding: 14px; border-radius: 10px; font-size: 0.7rem; color: rgba(244,241,234,0.85); text-align: left; overflow-x: auto; margin: 0.8rem 0; font-family: ui-monospace, monospace; white-space: pre;">wrangler secret put CALLS_APP_ID
wrangler secret put CALLS_APP_TOKEN
wrangler deploy</pre>
        </div>
      {:else if status === 'error'}
        <div class="box"><p class="eyebrow">UNABLE TO CONNECT</p><p>{errorText}</p></div>
      {:else if roster.length === 0}
        <div class="box">
          <p class="eyebrow">WAITING</p>
          <p>the call hasn't started yet.</p>
        </div>
      {:else}
        <div class="grid {gridClass}">
          {#each roster as peer (peer.peerId)}
            {@const stream = remoteStreams.get(peer.peerId)}
            {@const state = peerStates.get(peer.peerId) || {}}
            <div class="tile">
              {#if stream && !state.cameraOff}
                <video
                  use:bindStream={stream}
                  autoplay
                  muted
                  playsinline
                ></video>
              {:else}
                <div class="avatar-placeholder">
                  {#if peer.avatar}
                    <img src={peer.avatar} alt={peer.name} />
                  {:else}
                    <span>{(peer.name || '?').slice(0, 1).toUpperCase()}</span>
                  {/if}
                </div>
              {/if}
              <div class="tile-label">
                {#if state.muted}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ea8238" stroke-width="2"><path d="M1 1l22 22"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/></svg>
                {/if}
                <span>{peer.name}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <aside class="chat">
      <div class="chat-header">
        <span class="eyebrow">CHAT</span>
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
      <div class="tip-row">
        {#each [10, 50, 100] as amount}
          <button
            class="tip-btn"
            class:active={selectedTip === amount}
            on:click={() => tip(amount)}
          >
            🪼 {amount}
          </button>
        {/each}
      </div>
      <div class="chat-input">
        <input
          type="text"
          placeholder={selectedTip > 0 ? `add a note with your ${selectedTip} tip` : 'say something'}
          bind:value={chatInput}
          on:keydown={onChatKeydown}
        />
        <button on:click={sendChat}>SEND</button>
      </div>
    </aside>
  </main>

  <footer class="controls">
    {#if roomFull}
      <button class="pill disabled" disabled>
        CALL IS FULL · 8/8
      </button>
    {:else}
      <a class="pill primary" href="/room/{roomId}">TAKE A SEAT ({roster.length}/8)</a>
    {/if}
    <button class="pill" on:click={copyWatchLink}>COPY WATCH LINK</button>
  </footer>
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

  .topbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 14px 22px;
    border-bottom: 1px solid rgba(244, 241, 234, 0.08);
  }
  .brand { display: flex; align-items: center; gap: 8px; }
  .eyebrow {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    color: rgba(244, 241, 234, 0.55);
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(234, 60, 56, 0.9); }
  .dot.pulse { animation: pulse 1.4s ease-out infinite; }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(234, 60, 56, 0.6); }
    50% { box-shadow: 0 0 0 8px rgba(234, 60, 56, 0); }
  }
  .counts {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: rgba(244, 241, 234, 0.6);
    font-weight: 600;
    margin-left: auto;
  }
  .counts .sep { margin: 0 6px; color: rgba(244, 241, 234, 0.25); }

  .main {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 0;
    overflow: hidden;
  }

  .stage {
    padding: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }

  .grid { display: grid; gap: 14px; width: 100%; max-height: calc(100vh - 180px); }
  .grid-1 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr 1fr; }
  .grid-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
  .grid-6 { grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; }
  .grid-8 { grid-template-columns: repeat(4, 1fr); grid-template-rows: 1fr 1fr; }

  .tile {
    position: relative;
    aspect-ratio: 4/3;
    background: #0f0f0f;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(244, 241, 234, 0.08);
  }
  .tile video { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.2) contrast(1.05); }
  .avatar-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #151515; font-family: 'Forum', serif; font-size: 4rem; color: rgba(244, 241, 234, 0.4); }
  .avatar-placeholder img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; filter: grayscale(1) contrast(1.1); }
  .tile-label { position: absolute; bottom: 10px; left: 10px; padding: 5px 10px; background: rgba(0,0,0,0.6); border-radius: 999px; font-size: 0.7rem; display: flex; align-items: center; gap: 5px; backdrop-filter: blur(8px); }

  .box { text-align: center; padding: 2rem; border: 1px solid rgba(244, 241, 234, 0.08); border-radius: 16px; background: rgba(244, 241, 234, 0.02); max-width: 400px; }
  .box p { margin: 0.4rem 0; font-size: 0.85rem; color: rgba(244, 241, 234, 0.7); }

  .chat { background: #0b0b0b; border-left: 1px solid rgba(244, 241, 234, 0.08); display: flex; flex-direction: column; min-height: 0; }
  .chat-header { padding: 14px 16px; border-bottom: 1px solid rgba(244, 241, 234, 0.06); }
  .chat-scroll { flex: 1; overflow-y: auto; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
  .chat-msg { font-size: 0.8rem; line-height: 1.4; color: rgba(244, 241, 234, 0.85); }
  .chat-msg.tip { background: linear-gradient(135deg, rgba(255, 180, 50, 0.16), rgba(234, 130, 56, 0.08)); border: 1px solid rgba(255, 180, 50, 0.28); border-radius: 10px; padding: 6px 10px; }
  .chat-from { font-weight: 600; color: #ea8238; margin-right: 5px; }
  .chat-tip { color: #ffcc55; font-weight: 700; margin-right: 5px; }

  .tip-row { display: flex; gap: 6px; padding: 8px 12px; border-top: 1px solid rgba(244, 241, 234, 0.06); }
  .tip-btn { flex: 1; background: rgba(244, 241, 234, 0.04); border: 1px solid rgba(244, 241, 234, 0.12); color: rgba(244, 241, 234, 0.8); padding: 7px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 600; cursor: pointer; }
  .tip-btn:hover { background: rgba(255, 180, 50, 0.1); border-color: rgba(255, 180, 50, 0.4); color: #ffcc55; }
  .tip-btn.active { background: linear-gradient(135deg, rgba(255, 180, 50, 0.3), rgba(234, 130, 56, 0.2)); border-color: rgba(255, 180, 50, 0.6); color: #ffcc55; }

  .chat-input { padding: 10px 12px; border-top: 1px solid rgba(244, 241, 234, 0.06); display: flex; gap: 6px; }
  .chat-input input { flex: 1; background: rgba(244, 241, 234, 0.05); border: 1px solid rgba(244, 241, 234, 0.1); border-radius: 8px; padding: 7px 10px; color: #f4f1ea; font-size: 0.75rem; outline: none; }
  .chat-input button { background: #f4f1ea; color: #070707; border: none; border-radius: 8px; padding: 7px 12px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; }

  .controls { display: flex; align-items: center; gap: 12px; padding: 16px 22px; border-top: 1px solid rgba(244, 241, 234, 0.08); background: #0a0a0a; }
  .pill { background: transparent; border: 1px solid rgba(244, 241, 234, 0.18); color: rgba(244, 241, 234, 0.85); padding: 10px 20px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
  .pill:hover { background: rgba(244, 241, 234, 0.06); }
  .pill.primary { background: #f4f1ea; color: #070707; border-color: transparent; }
  .pill.primary:hover { background: #fff; }
  .pill.disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 720px) {
    .main { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
    .chat { border-left: none; border-top: 1px solid rgba(244, 241, 234, 0.08); max-height: 240px; }
  }
</style>

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

  let audioLevels = $state(new Map());
  const analysers = new Map();
  let audioCtx = null;
  let analyserInterval;

  const listenLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/voice/${roomId}/listen` : '';
  const roomFull = $derived(roster.length >= 8);

  const brandHost = $derived.by(() => {
    if (typeof window === 'undefined') return 'jelly-claw.com';
    const host = window.location.hostname;
    if (host && host.endsWith('.jelly-claw.com')) return host;
    const first = roster[0];
    if (first?.name) return `${first.name}.jelly-claw.com`;
    return 'jelly-claw.com';
  });

  onMount(async () => {
    try {
      const identity = anonymousIdentity();
      client = new SFUClient({
        wsUrl: signalingUrl(`/voice/${roomId}?mode=voice`),
        role: 'audience',
        name: identity.name,
        avatar: identity.avatar,
        mode: 'voice',
      });

      client.on('roster', (participants, audCount) => {
        roster = participants;
        audienceCount = audCount;
      });
      client.on('peer-left', (peerId) => {
        const next = new Map(remoteStreams);
        next.delete(peerId);
        remoteStreams = next;
        analysers.delete(peerId);
        const levels = new Map(audioLevels);
        levels.delete(peerId);
        audioLevels = levels;
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
        setupAnalyser(peerId, ms);
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

      analyserInterval = setInterval(() => {
        const newLevels = new Map();
        for (const [peerId, analyser] of analysers) {
          const data = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const x = (data[i] - 128) / 128;
            sum += x * x;
          }
          const rms = Math.sqrt(sum / data.length);
          newLevels.set(peerId, Math.min(1, rms * 4));
        }
        audioLevels = newLevels;
      }, 80);
    } catch (err) {
      if (err?.code === 'SFU_NOT_CONFIGURED' || err?.message === 'SFU_NOT_CONFIGURED') {
        errorText = 'SFU_NOT_CONFIGURED';
      } else {
        errorText = err?.message || 'Failed to listen';
      }
      status = 'error';
    }
  });

  onDestroy(() => {
    clearInterval(analyserInterval);
    client?.leave();
    audioCtx?.close();
  });

  function setupAnalyser(peerId, stream) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    try {
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      analysers.set(peerId, analyser);
    } catch {}
  }

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

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(listenLink());
    } catch {}
  }

  function bindStream(node, stream) {
    node.srcObject = stream;
    return { update(n) { if (node.srcObject !== n) node.srcObject = n; } };
  }
</script>

<svelte:head>
  <title>Listening · Jelly-Claw</title>
</svelte:head>

<div class="page">
  <div class="backdrop" aria-hidden="true">
    <img src="/editorial/model-shades-bw.jpg" alt="" class="backdrop-img" />
    <div class="backdrop-shade"></div>
    <div class="backdrop-blue"></div>
    <div class="backdrop-orange"></div>
    <div class="backdrop-grid"></div>
  </div>
  <header class="topbar">
    <div class="brand">
      <span class="eyebrow">JELLY CLAW / LIVE</span>
      <span class="dot" class:pulse={status === 'live'}></span>
    </div>
    <div class="counts">
      <span>{roster.length} ON MIC</span>
      <span class="sep">·</span>
      <span>{audienceCount} LISTENING</span>
    </div>
  </header>

  <div class="brand-banner" aria-hidden="true">
    <span class="brand-host">{brandHost}</span>
    <span class="brand-sep">//</span>
    <span class="brand-tag">AGENTIC SOCIAL MEDIA</span>
  </div>

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
        <div class="box"><p class="eyebrow">WAITING</p><p>the room is empty.</p></div>
      {:else}
        <div class="orbs">
          {#each roster as peer (peer.peerId)}
            {@const state = peerStates.get(peer.peerId) || {}}
            {@const level = audioLevels.get(peer.peerId) ?? 0}
            <div class="orb-wrap">
              <div class="orb-ring" style="transform: scale({1 + level * 0.5}); opacity: {0.25 + level * 0.7};"></div>
              <div class="orb" class:muted={state.muted}>
                {#if peer.avatar}
                  <img src={peer.avatar} alt={peer.name} />
                {:else}
                  <span class="orb-initial">{(peer.name || '?').slice(0, 1).toUpperCase()}</span>
                {/if}
                {#if state.muted}
                  <div class="mute-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"/></svg></div>
                {/if}
              </div>
              <div class="orb-name">{peer.name}</div>
            </div>
          {/each}

          {#each [...remoteStreams.entries()] as [peerId, stream] (peerId)}
            <audio use:bindStream={stream} autoplay playsinline></audio>
          {/each}
        </div>
      {/if}
    </div>

    <aside class="chat">
      <div class="chat-header"><span class="eyebrow">CHAT</span></div>
      <div class="chat-scroll">
        {#each chatMessages as msg (msg.id)}
          <div class="chat-msg" class:tip={msg.tip > 0}>
            <span class="chat-from">@{msg.from.name}</span>
            {#if msg.tip > 0}<span class="chat-tip">🪼 +{msg.tip}</span>{/if}
            <span>{msg.content}</span>
          </div>
        {/each}
      </div>
      <div class="tip-row">
        {#each [10, 50, 100] as amount}
          <button class="tip-btn" class:active={selectedTip === amount} on:click={() => tip(amount)}>🪼 {amount}</button>
        {/each}
      </div>
      <div class="chat-input">
        <input type="text" placeholder={selectedTip > 0 ? `add a note with your ${selectedTip} tip` : 'say something'} bind:value={chatInput} on:keydown={onChatKeydown} />
        <button on:click={sendChat}>SEND</button>
      </div>
    </aside>
  </main>

  <footer class="controls">
    <button class="pill" on:click={copyLink}>COPY LISTEN LINK</button>
  </footer>
</div>

<style>
  :global(body) { margin: 0; background: #070707; color: #f4f1ea; font-family: 'Montserrat', sans-serif; }
  .page { min-height: 100vh; background: #070707; color: #f4f1ea; display: flex; flex-direction: column; position: relative; overflow: hidden; }

  .backdrop { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
  .backdrop-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.1); opacity: 0.28; }
  .backdrop-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.95) 100%); }
  .backdrop-blue { position: absolute; inset: 0; background: radial-gradient(circle at 85% 15%, rgba(74,133,255,0.35), transparent 38%); mix-blend-mode: screen; }
  .backdrop-orange { position: absolute; inset: 0; background: radial-gradient(circle at 10% 90%, rgba(234,130,56,0.32), transparent 40%); mix-blend-mode: screen; }
  .backdrop-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 72px 72px; opacity: 0.35; }

  .brand-banner { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 8px 14px 10px; background: rgba(0,0,0,0.32); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(244,241,234,0.05); pointer-events: none; }
  .brand-host { color: rgba(244,241,234,0.95); font-family: 'Forum', serif; font-size: 0.95rem; letter-spacing: 0.02em; }
  .brand-sep { color: rgba(234,130,56,0.8); font-size: 0.8rem; }
  .brand-tag { color: rgba(244,241,234,0.55); font-size: 0.58rem; letter-spacing: 0.22em; font-weight: 600; }

  .topbar { position: relative; z-index: 2; display: flex; align-items: center; gap: 1rem; padding: 14px 22px; border-bottom: 1px solid rgba(244,241,234,0.06); }
  .brand { display: flex; align-items: center; gap: 8px; }
  .eyebrow { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.22em; color: rgba(244,241,234,0.55); }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(234,60,56,0.9); }
  .dot.pulse { animation: pulse 1.4s ease-out infinite; }
  @keyframes pulse { 0%,100%{box-shadow: 0 0 0 0 rgba(234,60,56,0.6);} 50%{box-shadow: 0 0 0 8px rgba(234,60,56,0);} }
  .counts { font-size: 0.7rem; letter-spacing: 0.1em; color: rgba(244,241,234,0.6); font-weight: 600; margin-left: auto; }
  .counts .sep { margin: 0 6px; color: rgba(244,241,234,0.25); }

  .main { position: relative; z-index: 2; flex: 1; display: grid; grid-template-columns: 1fr 320px; overflow: hidden; }
  .stage { padding: 40px 22px; display: flex; align-items: center; justify-content: center; }

  .orbs { display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; max-width: 900px; }
  .orb-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative; }
  .orb-ring { position: absolute; top: 0; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(56,152,236,0.35) 0%, transparent 70%); transition: transform 0.08s ease-out, opacity 0.08s ease-out; pointer-events: none; }
  .orb { position: relative; width: 120px; height: 120px; border-radius: 50%; background: #151515; border: 1.5px solid rgba(244,241,234,0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 0 40px rgba(56,152,236,0.15); }
  .orb img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.1); }
  .orb-initial { font-family: 'Forum', serif; font-size: 3.2rem; color: rgba(244,241,234,0.7); }
  .orb.muted { border-color: rgba(234,130,56,0.5); }
  .mute-badge { position: absolute; bottom: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: rgba(234,130,56,0.9); color: white; display: flex; align-items: center; justify-content: center; }
  .orb-name { font-size: 0.78rem; letter-spacing: 0.08em; color: rgba(244,241,234,0.75); font-weight: 500; }

  .box { text-align: center; padding: 2rem; border: 1px solid rgba(244,241,234,0.08); border-radius: 16px; background: rgba(244,241,234,0.02); max-width: 400px; }
  .box p { margin: 0.4rem 0; font-size: 0.85rem; color: rgba(244,241,234,0.7); }

  .chat { background: rgba(11,11,11,0.78); backdrop-filter: blur(22px); border-left: 1px solid rgba(244,241,234,0.06); display: flex; flex-direction: column; min-height: 0; }
  .chat-header { padding: 14px 16px; border-bottom: 1px solid rgba(244,241,234,0.06); }
  .chat-scroll { flex: 1; overflow-y: auto; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
  .chat-msg { font-size: 0.8rem; line-height: 1.4; color: rgba(244,241,234,0.85); }
  .chat-msg.tip { background: linear-gradient(135deg, rgba(255,180,50,0.16), rgba(234,130,56,0.08)); border: 1px solid rgba(255,180,50,0.28); border-radius: 10px; padding: 6px 10px; }
  .chat-from { font-weight: 600; color: #3898ec; margin-right: 5px; }
  .chat-tip { color: #ffcc55; font-weight: 700; margin-right: 5px; }
  .tip-row { display: flex; gap: 6px; padding: 8px 12px; border-top: 1px solid rgba(244,241,234,0.06); }
  .tip-btn { flex: 1; background: rgba(244,241,234,0.04); border: 1px solid rgba(244,241,234,0.12); color: rgba(244,241,234,0.8); padding: 7px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 600; cursor: pointer; }
  .tip-btn:hover { background: rgba(255,180,50,0.1); border-color: rgba(255,180,50,0.4); color: #ffcc55; }
  .tip-btn.active { background: linear-gradient(135deg, rgba(255,180,50,0.3), rgba(234,130,56,0.2)); border-color: rgba(255,180,50,0.6); color: #ffcc55; }
  .chat-input { padding: 10px 12px; border-top: 1px solid rgba(244,241,234,0.06); display: flex; gap: 6px; }
  .chat-input input { flex: 1; background: rgba(244,241,234,0.05); border: 1px solid rgba(244,241,234,0.1); border-radius: 8px; padding: 7px 10px; color: #f4f1ea; font-size: 0.75rem; outline: none; }
  .chat-input button { background: #f4f1ea; color: #070707; border: none; border-radius: 8px; padding: 7px 12px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; }

  .controls { position: relative; z-index: 2; display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid rgba(244,241,234,0.06); background: rgba(10,10,10,0.78); backdrop-filter: blur(22px); }
  .pill { background: transparent; border: 1px solid rgba(244,241,234,0.18); color: rgba(244,241,234,0.85); padding: 10px 20px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; cursor: pointer; text-decoration: none; }
  .pill:hover { background: rgba(244,241,234,0.06); }
  .pill.primary { background: #f4f1ea; color: #070707; border-color: transparent; }
  .pill.disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 720px) {
    .main { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
    .chat { border-left: none; border-top: 1px solid rgba(244,241,234,0.08); max-height: 240px; }
  }
</style>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { SFUClient, anonymousIdentity, signalingUrl } from '$lib/sfuClient.js';

  let { data } = $props();
  const roomId = data.roomId;

  let client = $state(null);
  let roster = $state([]);
  let remoteStreams = $state(new Map());
  let peerStates = $state(new Map());
  let localStream = $state(null);
  let selfPeerId = $state(null);
  let audienceCount = $state(0);
  let muted = $state(false);
  let chatMessages = $state([]);
  let chatInput = $state('');
  let isChatOpen = $state(false);
  let status = $state('connecting');
  let errorText = $state('');
  let copiedTooltip = $state('');

  // Audio levels for orb glow: peerId → RMS level 0..1
  let audioLevels = $state(new Map());
  let analyserInterval;
  const analysers = new Map();         // peerId → AnalyserNode
  let audioCtx = null;

  const participantLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/voice/${roomId}` : '';
  const listenLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/voice/${roomId}/listen` : '';

  const brandHost = $derived.by(() => {
    if (typeof window === 'undefined') return 'jelly-claw.com';
    const host = window.location.hostname;
    if (host && host.endsWith('.jelly-claw.com')) return host;
    const first = roster[0];
    if (first?.name) return `${first.name}.jelly-claw.com`;
    return 'jelly-claw.com';
  });

  const orbs = $derived.by(() => {
    const list = [];
    if (localStream) {
      list.push({
        peerId: 'self',
        name: 'you',
        avatar: '',
        isSelf: true,
        muted,
      });
    }
    for (const p of roster) {
      if (p.peerId === selfPeerId) continue;
      const ps = peerStates.get(p.peerId) || {};
      list.push({
        peerId: p.peerId,
        name: p.name,
        avatar: p.avatar,
        isSelf: false,
        muted: ps.muted === true,
      });
    }
    return list;
  });

  onMount(async () => {
    try {
      const identity = anonymousIdentity();
      client = new SFUClient({
        wsUrl: signalingUrl(`/voice/${roomId}?mode=voice`),
        role: 'participant',
        name: identity.name,
        avatar: identity.avatar,
        mode: 'voice',
      });

      client.on('hello-ack', (ack) => {
        selfPeerId = ack.peerId;
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
        if (msg === 'room-full') {
          errorText = 'This room is full (8/8). Listen instead.';
          status = 'error';
        } else if (status !== 'live') {
          errorText = msg;
          status = 'error';
        }
      });

      await client.connect();

      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setupAnalyser('self', localStream);

      await client.publishMedia(localStream);
      status = 'live';

      // Drive the level meter
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
        errorText = err?.message || 'Failed to join room';
      }
      status = 'error';
    }
  });

  onDestroy(() => {
    clearInterval(analyserInterval);
    client?.leave();
    if (localStream) for (const t of localStream.getTracks()) t.stop();
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
    } catch (e) {
      console.error('[VoiceRoom] analyser setup failed', peerId, e);
    }
  }

  function toggleMute() {
    muted = !muted;
    client?.setMuted(muted);
  }

  function endCall() {
    client?.leave();
    if (typeof window !== 'undefined') {
      window.close();
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

  function bindStream(node, stream) {
    node.srcObject = stream;
    return { update(n) { if (node.srcObject !== n) node.srcObject = n; } };
  }
</script>

<svelte:head>
  <title>Voice Room · Jelly-Claw</title>
</svelte:head>

<div class="page">
  <div class="backdrop" aria-hidden="true">
    <img src="/editorial/model-shades-bw.jpg" alt="" class="backdrop-img" />
    <div class="backdrop-shade"></div>
    <div class="backdrop-blue"></div>
    <div class="backdrop-orange"></div>
    <div class="backdrop-grid"></div>
  </div>
  <div class="brand-banner" aria-hidden="true">
    <span class="brand-host">{brandHost}</span>
    <span class="brand-sep">//</span>
    <span class="brand-tag">AGENTIC SOCIAL MEDIA</span>
  </div>

  <header class="topbar">
    <div class="brand">
      <span class="eyebrow">JELLY CLAW / VOICE ROOM</span>
      <span class="dot" class:pulse={status === 'live'}></span>
    </div>
    <div class="counts">
      <span>{orbs.length} ON MIC</span>
      <span class="sep">·</span>
      <span>{audienceCount} LISTENING</span>
    </div>
    <div class="topbar-actions">
      <button class="icon-btn" on:click={() => (isChatOpen = !isChatOpen)} title="chat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
  </header>

  <main class="main" class:with-chat={isChatOpen}>
    <div class="stage">
      {#if status === 'error' && errorText === 'SFU_NOT_CONFIGURED'}
        <div class="box">
          <p class="eyebrow">CLOUDFLARE REALTIME NOT SET UP</p>
          <p style="font-size: 0.8rem;">The signaling server needs Cloudflare Realtime SFU secrets. Run:</p>
          <pre style="background: rgba(244,241,234,0.05); border: 1px solid rgba(244,241,234,0.12); padding: 14px; border-radius: 10px; font-size: 0.7rem; color: rgba(244,241,234,0.85); text-align: left; overflow-x: auto; margin: 0.8rem 0; font-family: ui-monospace, monospace; white-space: pre;">wrangler secret put CALLS_APP_ID
wrangler secret put CALLS_APP_TOKEN
wrangler deploy</pre>
          <p style="font-size: 0.72rem; opacity: 0.55;">1:1 calls work without this.</p>
        </div>
      {:else if status === 'error'}
        <div class="box">
          <p class="eyebrow">SOMETHING WENT WRONG</p>
          <p>{errorText}</p>
          <a href="/voice/{roomId}/listen" class="btn-outline">LISTEN INSTEAD</a>
        </div>
      {:else if status === 'connecting'}
        <div class="box"><p class="eyebrow">CONNECTING</p><p>Allow mic access to join.</p></div>
      {:else}
        <div class="orbs">
          {#each orbs as orb (orb.peerId)}
            {@const level = audioLevels.get(orb.peerId) ?? 0}
            <div class="orb-wrap">
              <div
                class="orb-ring"
                style="transform: scale({1 + level * 0.5}); opacity: {0.25 + level * 0.7};"
              ></div>
              <div class="orb" class:muted={orb.muted}>
                {#if orb.avatar}
                  <img src={orb.avatar} alt={orb.name} />
                {:else}
                  <span class="orb-initial">{orb.name.slice(0, 1).toUpperCase()}</span>
                {/if}
                {#if orb.muted}
                  <div class="mute-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"/></svg>
                  </div>
                {/if}
              </div>
              <div class="orb-name">{orb.name}</div>
            </div>
          {/each}

          <!-- Invisible audio sinks for remote playback -->
          {#each [...remoteStreams.entries()] as [peerId, stream] (peerId)}
            <audio use:bindStream={stream} autoplay playsinline></audio>
          {/each}
        </div>
      {/if}
    </div>

    {#if isChatOpen}
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
        <div class="chat-input">
          <input type="text" placeholder="say something" bind:value={chatInput} on:keydown={onChatKeydown} />
          <button on:click={sendChat}>SEND</button>
        </div>
      </aside>
    {/if}
  </main>

  <footer class="controls">
    <button class="ctrl" class:active={muted} on:click={toggleMute} title="mute">
      {#if muted}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/></svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
      {/if}
    </button>

    <div class="link-buttons">
      <button class="pill" on:click={() => copyLink(participantLink(), 'Participant link')}>COPY MIC LINK</button>
      <button class="pill" on:click={() => copyLink(listenLink(), 'Listen link')}>COPY LISTEN LINK</button>
    </div>

    <button class="ctrl end" on:click={endCall} title="leave">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
    </button>
  </footer>

  {#if copiedTooltip}<div class="toast">{copiedTooltip}</div>{/if}
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

  .brand-banner { position: absolute; top: 14px; right: 22px; z-index: 3; display: flex; align-items: center; gap: 10px; padding: 6px 14px; background: rgba(0,0,0,0.45); backdrop-filter: blur(12px); border: 1px solid rgba(244,241,234,0.1); border-radius: 999px; pointer-events: none; }
  .brand-host { color: rgba(244,241,234,0.95); font-family: 'Forum', serif; font-size: 0.95rem; letter-spacing: 0.02em; }
  .brand-sep { color: rgba(234,130,56,0.8); font-size: 0.8rem; }
  .brand-tag { color: rgba(244,241,234,0.55); font-size: 0.58rem; letter-spacing: 0.22em; font-weight: 600; }

  .topbar { position: relative; z-index: 2; display: flex; align-items: center; gap: 1rem; padding: 14px 22px; border-bottom: 1px solid rgba(244,241,234,0.06); }
  .brand { display: flex; align-items: center; gap: 8px; }
  .eyebrow { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.22em; color: rgba(244,241,234,0.55); }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(56, 152, 236, 0.9); }
  .dot.pulse { animation: pulse 1.6s ease-out infinite; }
  @keyframes pulse { 0%,100%{box-shadow: 0 0 0 0 rgba(56,152,236,0.6);} 50%{box-shadow: 0 0 0 8px rgba(56,152,236,0);} }
  .counts { font-size: 0.7rem; letter-spacing: 0.1em; color: rgba(244,241,234,0.6); font-weight: 600; }
  .counts .sep { margin: 0 6px; color: rgba(244,241,234,0.25); }
  .topbar-actions { margin-left: auto; display: flex; gap: 8px; }
  .icon-btn { width: 30px; height: 30px; border-radius: 50%; background: rgba(244,241,234,0.05); border: 1px solid rgba(244,241,234,0.12); color: rgba(244,241,234,0.85); display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .icon-btn:hover { background: rgba(244,241,234,0.1); }

  .main { position: relative; z-index: 2; flex: 1; display: grid; grid-template-columns: 1fr; overflow: hidden; }
  .main.with-chat { grid-template-columns: 1fr 320px; }

  .stage { padding: 40px 22px; display: flex; align-items: center; justify-content: center; }

  .orbs { display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; max-width: 900px; }
  .orb-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .orb-ring { position: absolute; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(56,152,236,0.35) 0%, transparent 70%); transition: transform 0.08s ease-out, opacity 0.08s ease-out; pointer-events: none; }
  .orb { position: relative; width: 120px; height: 120px; border-radius: 50%; background: #151515; border: 1.5px solid rgba(244,241,234,0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 0 40px rgba(56,152,236,0.15); }
  .orb img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.1); }
  .orb-initial { font-family: 'Forum', serif; font-size: 3.2rem; color: rgba(244,241,234,0.7); }
  .orb.muted { border-color: rgba(234,130,56,0.5); }
  .mute-badge { position: absolute; bottom: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: rgba(234,130,56,0.9); color: white; display: flex; align-items: center; justify-content: center; }
  .orb-name { font-size: 0.78rem; letter-spacing: 0.08em; color: rgba(244,241,234,0.75); font-weight: 500; }

  .box { text-align: center; padding: 2rem; border: 1px solid rgba(244,241,234,0.08); border-radius: 16px; background: rgba(244,241,234,0.02); max-width: 400px; }
  .box p { margin: 0.4rem 0; font-size: 0.85rem; color: rgba(244,241,234,0.7); }
  .btn-outline { display: inline-block; margin-top: 1rem; padding: 9px 18px; border: 1px solid rgba(244,241,234,0.25); border-radius: 999px; color: #f4f1ea; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-decoration: none; }

  .chat { background: rgba(11,11,11,0.78); backdrop-filter: blur(22px); border-left: 1px solid rgba(244,241,234,0.06); display: flex; flex-direction: column; min-height: 0; }
  .chat-header { padding: 14px 16px; border-bottom: 1px solid rgba(244,241,234,0.06); }
  .chat-scroll { flex: 1; overflow-y: auto; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
  .chat-msg { font-size: 0.8rem; line-height: 1.4; color: rgba(244,241,234,0.85); }
  .chat-msg.tip { background: linear-gradient(135deg, rgba(255,180,50,0.14), rgba(234,130,56,0.06)); border: 1px solid rgba(255,180,50,0.25); border-radius: 10px; padding: 6px 10px; }
  .chat-from { font-weight: 600; color: #3898ec; margin-right: 5px; }
  .chat-tip { color: #ffcc55; font-weight: 700; margin-right: 5px; }
  .chat-input { padding: 10px 12px; border-top: 1px solid rgba(244,241,234,0.06); display: flex; gap: 6px; }
  .chat-input input { flex: 1; background: rgba(244,241,234,0.05); border: 1px solid rgba(244,241,234,0.1); border-radius: 8px; padding: 7px 10px; color: #f4f1ea; font-size: 0.75rem; outline: none; }
  .chat-input button { background: #f4f1ea; color: #070707; border: none; border-radius: 8px; padding: 7px 12px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; }

  .controls { position: relative; z-index: 2; display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid rgba(244,241,234,0.06); background: rgba(10,10,10,0.78); backdrop-filter: blur(22px); }
  .ctrl { width: 42px; height: 42px; border-radius: 50%; background: rgba(244,241,234,0.06); border: 1px solid rgba(244,241,234,0.12); color: #f4f1ea; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .ctrl:hover { background: rgba(244,241,234,0.12); }
  .ctrl.active { background: rgba(234,130,56,0.18); border-color: rgba(234,130,56,0.5); color: #ea8238; }
  .ctrl.end { background: linear-gradient(135deg, #b53120, #ea8238); border-color: transparent; color: white; margin-left: auto; }
  .link-buttons { display: flex; gap: 8px; margin-left: 12px; }
  .pill { background: transparent; border: 1px solid rgba(244,241,234,0.18); color: rgba(244,241,234,0.85); padding: 9px 16px; border-radius: 999px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.14em; cursor: pointer; }
  .pill:hover { background: rgba(244,241,234,0.06); }

  .toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: #f4f1ea; color: #070707; padding: 8px 18px; border-radius: 999px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; box-shadow: 0 6px 24px rgba(0,0,0,0.5); }

  @media (max-width: 720px) {
    .main.with-chat { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
    .chat { border-left: none; border-top: 1px solid rgba(244,241,234,0.08); max-height: 240px; }
    .link-buttons { display: none; }
  }
</style>

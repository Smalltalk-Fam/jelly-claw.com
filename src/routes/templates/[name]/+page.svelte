<script>
  import { onMount } from 'svelte';

  let { data } = $props();
  let jellyText = $state(data.prefillText);
  let username = $state(data.prefillUsername);
  let profile = $state(null);
  let proxiedPfp = $state('');
  let loading = $state(false);
  let cardEl = $state(null);
  let copyLabel = $state('Copy as Image');

  onMount(() => {
    if (data.prefillUsername) fetchProfile();
  });

  const bgPhotos = [
    { url: 'https://images.pexels.com/photos/987577/pexels-photo-987577.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Godisable Jacob' },
    { url: 'https://images.pexels.com/photos/13900337/pexels-photo-13900337.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Richard O.' },
    { url: 'https://images.pexels.com/photos/29721765/pexels-photo-29721765.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Lara Stratiychuk' },
    { url: 'https://images.pexels.com/photos/7654083/pexels-photo-7654083.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'cottonbro' },
    { url: 'https://images.pexels.com/photos/22742255/pexels-photo-22742255.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Jayro Cerqueira da Silva' },
    { url: 'https://images.pexels.com/photos/19799261/pexels-photo-19799261.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Aleksandar Andreev' },
    { url: 'https://images.pexels.com/photos/10721273/pexels-photo-10721273.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'holyly7' },
    { url: 'https://images.pexels.com/photos/27651006/pexels-photo-27651006.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Matvalina' },
    { url: 'https://images.pexels.com/photos/33351990/pexels-photo-33351990.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Mohsen Babaei' },
    { url: 'https://images.pexels.com/photos/32314084/pexels-photo-32314084.jpeg?auto=compress&cs=tinysrgb&w=800', credit: 'Upender Photography' },
  ];

  let currentBgIndex = $state(Math.floor(Math.random() * bgPhotos.length));
  let currentBg = $derived(bgPhotos[currentBgIndex]);
  let proxiedBg = $derived(`/api/proxy-image?url=${encodeURIComponent(currentBg.url)}`);

  function shuffleBg() {
    let next;
    do { next = Math.floor(Math.random() * bgPhotos.length); } while (next === currentBgIndex && bgPhotos.length > 1);
    currentBgIndex = next;
  }

  const ratios = [
    { label: '1:1', value: '1 / 1' },
    { label: '4:5', value: '4 / 5' },
    { label: '16:9', value: '16 / 9' },
    { label: '9:16', value: '9 / 16' },
  ];
  let selectedRatio = $state('1 / 1');

  const t = data.template;

  async function fetchProfile() {
    const u = username.trim().replace(/^@/, '');
    if (!u) return;
    loading = true;
    try {
      const res = await fetch(
        `https://api.jellyjelly.com/v3/jelly/search?username=${encodeURIComponent(u)}&page_size=1&sort_by=date`
      );
      const data = await res.json();
      const jellies = data.jellies || [];
      const user = jellies[0]?.participants?.find(p => p.username === u);
      if (user) {
        profile = {
          fullName: user.full_name,
          username: user.username,
          pfpUrl: user.pfp_url,
        };
        proxiedPfp = user.pfp_url
          ? `/api/proxy-image?url=${encodeURIComponent(user.pfp_url)}`
          : '';
      } else {
        profile = null;
        proxiedPfp = '';
      }
    } catch {
      profile = null;
    }
    loading = false;
  }

  function handleUsernameKey(e) {
    if (e.key === 'Enter') fetchProfile();
  }

  async function copyAsImage() {
    if (!cardEl) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardEl, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        copyLabel = 'Copied!';
        setTimeout(() => (copyLabel = 'Copy as Image'), 1800);
      } catch {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jelly-tweet.png';
        a.click();
        URL.revokeObjectURL(url);
        copyLabel = 'Downloaded!';
        setTimeout(() => (copyLabel = 'Copy as Image'), 1800);
      }
    }, 'image/png');
  }

  async function downloadImage() {
    if (!cardEl) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardEl, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jelly-tweet.png';
    a.click();
  }
</script>

<svelte:head>
  <title>{t ? t.title : 'Not Found'} — Templates — Jelly Claw</title>
</svelte:head>

{#if data.notFound}
  <div class="not-found">
    <p class="eyebrow">404</p>
    <h1>Template not found</h1>
    <p>No template called "{data.name}".</p>
    <a href="/templates">Back to templates</a>
  </div>
{:else}
  <div class="template-page">
    <header>
      <a class="back" href="/templates">&larr; Templates</a>
      <h1>{t.title}</h1>
      <p class="desc">{t.description}</p>
    </header>

    <div class="workspace">
      <div class="input-side">
        <label for="username-input">Jelly username</label>
        <div class="username-row">
          <input
            id="username-input"
            type="text"
            bind:value={username}
            onkeydown={handleUsernameKey}
            placeholder="e.g. iqram"
          />
          <button class="btn secondary" onclick={fetchProfile} disabled={loading || !username.trim()}>
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
        {#if profile}
          <div class="profile-pill">
            {#if profile.pfpUrl}
              <img class="pill-pfp" src={profile.pfpUrl} alt={profile.fullName} />
            {/if}
            <span>{profile.fullName}</span>
            <span class="pill-handle">@{profile.username}</span>
          </div>
        {/if}

        <label for="jelly-input">Paste your jelly</label>
        <textarea
          id="jelly-input"
          bind:value={jellyText}
          placeholder="Paste a jelly here..."
          rows="6"
        ></textarea>

        <label>Aspect ratio</label>
        <div class="ratio-row">
          {#each ratios as r}
            <button
              class="ratio-btn"
              class:active={selectedRatio === r.value}
              onclick={() => (selectedRatio = r.value)}
            >
              {r.label}
            </button>
          {/each}
        </div>

        <div class="actions">
          <button class="btn primary" onclick={copyAsImage} disabled={!jellyText.trim()}>
            {copyLabel}
          </button>
          <button class="btn secondary" onclick={downloadImage} disabled={!jellyText.trim()}>
            Download PNG
          </button>
        </div>
      </div>

      <div class="preview-side">
        <p class="preview-label">Preview</p>
        <div
          class="card"
          bind:this={cardEl}
          style="border: 3px solid {t.border}; padding: {t.padding}px; aspect-ratio: {selectedRatio};"
        >
          <img class="card-bg" src={proxiedBg} alt="" />
          <div class="card-bg-color" style="background: {t.bg};"></div>
          <img class="jelly-logo" src="/api/proxy-image?url={encodeURIComponent('https://jellyjelly.com/.well-known/jellyjelly-together.png')}" alt="JellyJelly" />
          <div class="tweet-body">
            <div class="tweet-header">
              {#if proxiedPfp}
                <img class="avatar" src={proxiedPfp} alt={profile?.fullName || ''} />
              {:else}
                <div class="avatar avatar-placeholder"></div>
              {/if}
              <div class="tweet-meta">
                <span class="tweet-name">{profile?.fullName || 'Jelly'}</span>
                <span class="tweet-handle">@{profile?.username || 'jellyjelly'}</span>
              </div>
            </div>
            <p class="tweet-text">{jellyText || 'Your jelly text will appear here...'}</p>
          </div>
        </div>
        <div class="card-credit">
          <button class="shuffle-btn" onclick={shuffleBg}>&#8635; Shuffle</button>
          <span class="credit-text">Photo by {currentBg.credit} / Pexels</span>
        </div>
      </div>
    </div>

    <details class="md-section">
      <summary>Claude Instruction (.md)</summary>
      <pre class="md-block"><code>{`# Jelly as Tweet Template

## Instruction
Generate a shareable tweet-style image from the following jelly content.
Preview URL: /templates/jelly-as-tweet?username=${profile?.username || '{username}'}&text=${encodeURIComponent(jellyText || '{text}')}

## Visual Spec
- Aspect ratio: ${ratios.find(r => r.value === selectedRatio)?.label || '1:1'}
- Background: black & white editorial photo with ${t.bg} (blue) overlay at 55% opacity, mix-blend-mode multiply
- No rounded corners on outer card — sharp edges
- Inner padding: ${t.padding}px
- JellyJelly logo (https://jellyjelly.com/.well-known/jellyjelly-together.png) top-right, 20px from edges, white, 28px tall
- Tweet card: white (#ffffff) background, 12px border-radius, padding 20px 24px
- Avatar: 40px circle${profile ? `, image: ${profile.pfpUrl}` : ', gray placeholder'}
- Name: ${profile?.fullName || '{full_name}'}, bold, 15px, color #0f1419
- Handle: @${profile?.username || '{username}'}, #536471, 13px
- Text: 15px, color #0f1419, line-height 1.5, pre-wrap
- Output: 2x PNG for retina

## URL Params
- username: JellyJelly username (auto-fetches profile photo, name, handle from API)
- text: the jelly content to display

## Content
\`\`\`
${jellyText || '[paste jelly content here]'}
\`\`\`
`}</code></pre>
    </details>
  </div>
{/if}

<style>
  .template-page {
    min-height: 100vh;
    color: #f4f1ea;
    padding: 2.5rem 1.5rem;
    max-width: 1000px;
    margin: 0 auto;
    font-family: 'Montserrat', sans-serif;
  }

  .not-found {
    min-height: 100vh;
    color: #f4f1ea;
    padding: 4rem 1.5rem;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
  }

  .not-found h1 {
    font-family: 'Forum', serif;
    font-size: 2.4rem;
    font-weight: 400;
    margin: 0.5rem 0 1rem;
  }

  .not-found a {
    color: #4a85ff;
  }

  .back {
    font-size: 0.75rem;
    color: rgba(244, 241, 234, 0.5);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 150ms;
  }

  .back:hover {
    color: #f4f1ea;
  }

  header h1 {
    font-family: 'Forum', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 400;
    margin: 0.5rem 0 0.3rem;
  }

  .desc {
    color: rgba(244, 241, 234, 0.45);
    font-size: 0.85rem;
    margin: 0 0 2rem;
  }

  .workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .input-side {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(244, 241, 234, 0.5);
  }

  .username-row {
    display: flex;
    gap: 0.5rem;
  }

  input[type="text"] {
    flex: 1;
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    color: #f4f1ea;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9rem;
    padding: 10px 14px;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: #4a85ff;
  }

  input[type="text"]::placeholder {
    color: rgba(244, 241, 234, 0.2);
  }

  .profile-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: rgba(74, 133, 255, 0.1);
    border: 1px solid rgba(74, 133, 255, 0.25);
    border-radius: 999px;
    font-size: 0.8rem;
    width: fit-content;
  }

  .pill-pfp {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }

  .pill-handle {
    color: rgba(244, 241, 234, 0.4);
    font-size: 0.75rem;
  }

  textarea {
    width: 100%;
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    color: #f4f1ea;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9rem;
    padding: 14px 16px;
    resize: vertical;
    line-height: 1.6;
  }

  textarea:focus {
    outline: none;
    border-color: #4a85ff;
  }

  textarea::placeholder {
    color: rgba(244, 241, 234, 0.2);
  }

  .ratio-row {
    display: flex;
    gap: 0.5rem;
  }

  .ratio-btn {
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: rgba(244, 241, 234, 0.5);
    font-family: 'Montserrat', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 150ms;
  }

  .ratio-btn:hover {
    border-color: rgba(255, 255, 255, 0.35);
    color: #f4f1ea;
  }

  .ratio-btn.active {
    background: #f4f1ea;
    color: #080808;
    border-color: #f4f1ea;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .btn {
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 150ms, background 150ms, border-color 150ms;
    font-family: 'Montserrat', sans-serif;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .btn.primary {
    background: #f4f1ea;
    color: #080808;
    border-color: #f4f1ea;
  }

  .btn.secondary {
    background: transparent;
    color: #f4f1ea;
  }

  .btn.secondary:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.5);
  }

  .preview-side {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .preview-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(244, 241, 234, 0.5);
    margin: 0;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .card-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1);
    z-index: 0;
  }

  .card-bg-color {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.55;
    mix-blend-mode: multiply;
  }

  .jelly-logo {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 28px;
    width: auto;
    z-index: 3;
    filter: brightness(0) invert(1);
    opacity: 0.9;
  }

  .card-credit {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .shuffle-btn {
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: rgba(244, 241, 234, 0.6);
    font-family: 'Montserrat', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 150ms;
  }

  .shuffle-btn:hover {
    border-color: rgba(255, 255, 255, 0.4);
    color: #f4f1ea;
  }

  .credit-text {
    font-size: 0.62rem;
    color: rgba(244, 241, 234, 0.3);
    letter-spacing: 0.04em;
  }

  .tweet-body {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px 24px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  .tweet-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .avatar-placeholder {
    background: #cfd9de;
  }

  .tweet-meta {
    display: flex;
    flex-direction: column;
  }

  .tweet-name {
    font-weight: 700;
    font-size: 15px;
    color: #0f1419;
    line-height: 1.2;
  }

  .tweet-handle {
    font-size: 13px;
    color: #536471;
  }

  .tweet-text {
    font-size: 15px;
    color: #0f1419;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .md-section {
    margin-top: 2.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
  }

  summary {
    padding: 14px 18px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(244, 241, 234, 0.5);
    cursor: pointer;
    background: rgba(255, 255, 255, 0.03);
  }

  summary:hover {
    color: #f4f1ea;
  }

  .md-block {
    margin: 0;
    padding: 18px;
    background: #0a0a0a;
    overflow-x: auto;
    font-size: 0.78rem;
    line-height: 1.6;
    color: rgba(244, 241, 234, 0.7);
  }

  .md-block code {
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  @media (max-width: 700px) {
    .workspace {
      grid-template-columns: 1fr;
    }
  }
</style>

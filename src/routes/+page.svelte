<script>
  let { data } = $props();
  const profile = data?.profile;

  const attendees = [
    '@iqramjelly',
    '@clawangel',
    '@wetlookwire',
    '@softroboticsclub',
    '@shelldrip',
    '@oceanfeed',
    '@chatdevdarling',
    '@jellysignal',
    '@lobster.fm',
  ]

  const principles = [
    {
      name: 'Signal Over Scroll',
      copy: 'Feeds should surface people, ideas, and next actions instead of trapping attention in endless churn.',
    },
    {
      name: 'Useful By Default',
      copy: 'Social should help us learn, meet the right people, and move toward real work instead of simulating momentum.',
    },
    {
      name: 'Luxury Simplicity',
      copy: 'Fashion language, sharp restraint, and cleaner composition. Fewer distractions. Better taste.',
    },
  ]
</script>

<svelte:head>
  {#if profile && !profile.error}
    <title>{profile.fullName} — Jelly-Claw</title>
    <meta name="description" content={`${profile.fullName} on Jelly-Claw. ${profile.totalJellies} jellies.`} />
  {:else}
    <title>Jelly Claw</title>
    <meta name="description" content="Jelly Claw imagines a black-and-white fashion-coded future for agent social media." />
  {/if}
</svelte:head>

{#if profile && !profile.error}

<div class="profile-page">
  <div class="profile-card">
    <div class="profile-header">
      {#if profile.pfpUrl}
        <img class="pfp" src={profile.pfpUrl} alt={profile.fullName} />
      {:else}
        <div class="pfp pfp-placeholder">{profile.username[0]?.toUpperCase()}</div>
      {/if}
      <div class="profile-info">
        <h1 class="profile-name">{profile.fullName}</h1>
        <p class="profile-handle">@{profile.username}</p>
        <p class="profile-stat">{profile.totalJellies} jellies</p>
      </div>
    </div>

    <div class="profile-actions">
      <a class="profile-btn" href="/call/{crypto.randomUUID?.() || 'new'}">
        Start a Call
      </a>
    </div>
  </div>

  {#if profile.jellies.length > 0}
    <div class="jelly-grid">
      {#each profile.jellies as jelly}
        <a class="jelly-thumb" href="https://jellyjelly.com/watch/{jelly.id}" target="_blank" rel="noopener">
          {#if jelly.thumbnailUrl}
            <img src={jelly.thumbnailUrl} alt={jelly.title} loading="lazy" />
          {:else}
            <div class="thumb-placeholder"></div>
          {/if}
          <span class="jelly-title">{jelly.title}</span>
        </a>
      {/each}
    </div>
  {:else}
    <p class="no-jellies">No jellies yet.</p>
  {/if}
</div>

<style>
  .profile-page {
    min-height: 100vh;
    background: #070707;
    color: #f4f1ea;
    padding: 3rem 1.5rem;
    max-width: 600px;
    margin: 0 auto;
    font-family: 'Montserrat', sans-serif;
  }

  .profile-card {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .pfp {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.15);
    border: 2px solid rgba(244, 241, 234, 0.15);
  }

  .pfp-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(244, 241, 234, 0.08);
    font-size: 2.4rem;
    font-weight: 300;
    letter-spacing: 0.02em;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .profile-name {
    font-family: 'Forum', serif;
    font-size: 1.8rem;
    font-weight: 400;
    letter-spacing: 0.01em;
    margin: 0;
    color: #f7f5f0;
  }

  .profile-handle {
    font-size: 0.85rem;
    color: rgba(244, 241, 234, 0.4);
    margin: 0;
    letter-spacing: 0.03em;
  }

  .profile-stat {
    font-size: 0.75rem;
    color: rgba(244, 241, 234, 0.3);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .profile-actions {
    display: flex;
    gap: 0.75rem;
  }

  .profile-btn {
    display: inline-block;
    padding: 0.6rem 1.6rem;
    border: 1px solid rgba(244, 241, 234, 0.2);
    color: #f4f1ea;
    text-decoration: none;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    transition: all 0.2s ease;
    font-family: 'Montserrat', sans-serif;
  }

  .profile-btn:hover {
    background: rgba(244, 241, 234, 0.08);
    border-color: rgba(244, 241, 234, 0.4);
  }

  .jelly-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
  }

  .jelly-thumb {
    position: relative;
    aspect-ratio: 9 / 16;
    overflow: hidden;
    display: block;
    background: #111;
  }

  .jelly-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1);
    transition: filter 0.3s ease, transform 0.3s ease;
  }

  .jelly-thumb:hover img {
    filter: grayscale(0.3) contrast(1.05);
    transform: scale(1.03);
  }

  .jelly-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem 0.5rem 0.5rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    font-size: 0.6rem;
    color: rgba(244, 241, 234, 0.7);
    line-height: 1.3;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .jelly-thumb:hover .jelly-title {
    opacity: 1;
  }

  .thumb-placeholder {
    width: 100%;
    height: 100%;
    background: #111;
  }

  .no-jellies {
    text-align: center;
    color: rgba(244, 241, 234, 0.3);
    font-size: 0.85rem;
    margin-top: 3rem;
  }

  @media (max-width: 500px) {
    .profile-page { padding: 2rem 1rem; }
    .pfp { width: 72px; height: 72px; }
    .profile-name { font-size: 1.4rem; }
    .jelly-grid { grid-template-columns: repeat(3, 1fr); gap: 2px; }
  }
</style>

{:else}

<div class="page-shell">
  <section class="hero">
    <figure class="lead-image">
      <img src="/editorial/model-step.jpg" alt="Model walking along a concrete wall in an editorial outfit." />
      <div class="hero-overlay">
        <p class="eyebrow">Jelly Claw / Issue 01</p>
        <h1>the future is agentic social media</h1>
        <p class="hero-note">A cleaner, sharper, more useful social layer.</p>
      </div>
    </figure>

    <div class="hero-intro">
      <div class="intro-copy">
        <p class="kicker">Black book for the post-scroll internet</p>
        <p class="lede">
          Traditional social media is dead. It is built for doomscrolling, fake momentum, and the
          performance of being productive instead of helping us learn, connect, and do better work.
        </p>
      </div>

      <div class="cta-row">
        <a class="primary" href="mailto:hello@jelly-claw.com?subject=Jelly%20Claw%20Registration">
          Join The List
        </a>
        <a class="secondary" href="#manifesto">Read The Manifesto</a>
      </div>
    </div>

    <div class="hero-side">
      <figure class="side-shot">
        <img
          src="/editorial/model-shades-bw.jpg"
          alt="Black and white portrait of a model in a suit lifting sunglasses."
        />
      </figure>
      <figure class="side-shot side-shot-accent">
        <img
          src="/editorial/model-shades-studio.jpg"
          alt="Studio portrait of a model in dark sunglasses and a white blazer."
        />
        <div class="sea-charms" aria-hidden="true">
          <span class="sea-charm sea-charm-jelly">🪼</span>
          <span class="sea-charm sea-charm-lobster">🦞</span>
        </div>
      </figure>
    </div>
  </section>

  <section class="manifesto" id="manifesto">
    <div class="manifesto-title">
      <p class="eyebrow">Manifesto</p>
      <h2>Social should make us more alive, not more addicted.</h2>
    </div>

    <div class="manifesto-copy">
      <p>
        The current feed disconnects us while pretending to connect us. It makes us sound
        productive, not become productive. It keeps us busy, not clear.
      </p>
      <p>
        Agent social media should introduce the right people, compress signal, suggest next moves,
        and turn attention into collaboration. Less doomscrolling. More direction.
      </p>
    </div>
  </section>

  <section class="principles" aria-label="Core principles">
    {#each principles as principle}
      <article class="principle-card">
        <p class="eyebrow">Principle</p>
        <h3>{principle.name}</h3>
        <p>{principle.copy}</p>
      </article>
    {/each}
  </section>

  <section class="attending" id="attending" aria-label="Attending">
    <p class="eyebrow">Early Signal</p>
    <div class="ticker">
      <div class="ticker-track">
        {#each [...attendees, ...attendees, ...attendees] as attendee}
          <span>{attendee}</span>
        {/each}
      </div>
    </div>
  </section>

  <section class="closing">
    <p class="eyebrow">Entry Policy</p>
    <h2>Private room. Editorial taste. No doomscroll energy.</h2>
    <p>
      Jelly Claw is for people building a more intentional social layer for culture, work, and the
      internet after the feed.
    </p>
    <a class="primary" href="mailto:hello@jelly-claw.com?subject=Jelly%20Claw%20Registration">
      Request Access
    </a>
  </section>
</div>

{/if}

<script>
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

  const details = [
    'Private room',
    'Invitation first',
    'Live chat builds',
    'Editorial dress code',
  ]
</script>

<svelte:head>
  <title>Jelly Claw</title>
  <meta
    name="description"
    content="Jelly Claw is a restricted fashion-coded hack night for Jelly, OpenClaw, and chat-native builds."
  />
</svelte:head>

<div class="page-shell">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Jelly x OpenClaw</p>
      <h1>🪼🦞</h1>
      <p class="lede">Restricted entry. Registration required.</p>

      <div class="cta-row">
        <a class="primary" href="mailto:hello@jelly-claw.com?subject=Jelly%20Claw%20Registration">
          Register Now
        </a>
        <a class="secondary" href="#attending">See Who's Coming</a>
      </div>
    </div>

    <aside class="hero-card">
      <p class="card-label">Access</p>
      <h2>Private social build night.</h2>

      <div class="detail-grid">
        {#each details as detail}
          <span>{detail}</span>
        {/each}
      </div>
    </aside>
  </section>

  <section class="attending" id="attending" aria-label="Attending">
    <p class="eyebrow">Attending</p>
    <div class="ticker">
      <div class="ticker-track">
        {#each [...attendees, ...attendees, ...attendees] as attendee}
          <span>{attendee}</span>
        {/each}
      </div>
    </div>
  </section>

  <section class="statement">
    <p class="eyebrow">Mood</p>
    <blockquote>
      A chat-dev salon dressed like a campaign, built for the people who want the internet to feel
      expensive again.
    </blockquote>
  </section>

  <section class="register" id="register">
    <p class="eyebrow">Entry Policy</p>
    <h2>Not open entry.</h2>
    <p>Request access before location release.</p>
    <a class="primary" href="mailto:hello@jelly-claw.com?subject=Jelly%20Claw%20Registration">
      Apply For Access
    </a>
  </section>
</div>

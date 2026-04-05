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
  <title>Jelly Claw</title>
  <meta
    name="description"
    content="Jelly Claw imagines a black-and-white fashion-coded future for agent social media."
  />
</svelte:head>

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

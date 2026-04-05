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
      name: 'Social That Helps',
      copy: 'The network should make us feel more connected, more informed, and more capable of shipping something real.',
    },
    {
      name: 'Editorial Presence',
      copy: 'Black-and-white, fashion-coded, and intentional. Less clutter. More taste. More point of view.',
    },
  ]

  const gallery = [
    {
      src: '/editorial/model-step.jpg',
      alt: 'Model walking along a concrete wall in an editorial outfit.',
      label: 'Look 01',
    },
    {
      src: '/editorial/model-shades-bw.jpg',
      alt: 'Black and white portrait of a model in a suit lifting sunglasses.',
      label: 'Look 02',
    },
    {
      src: '/editorial/model-shades-studio.jpg',
      alt: 'Studio portrait of a model in dark sunglasses and a white blazer.',
      label: 'Look 03',
    },
  ]
</script>

<svelte:head>
  <title>Jelly Claw</title>
  <meta
    name="description"
    content="Jelly Claw is a monochrome editorial landing page for agentic social media, fashion-coded builds, and a more intentional internet."
  />
</svelte:head>

<div class="page-shell">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Jelly Claw / Issue 01</p>
      <p class="kicker">Black Book For A Better Feed</p>
      <h1>Fashion-coded social for the post-scroll internet.</h1>
      <p class="lede">
        A chique black-and-white world for people who want social media to look sharp, think
        clearly, and actually move culture forward.
      </p>

      <div class="cta-row">
        <a class="primary" href="mailto:hello@jelly-claw.com?subject=Jelly%20Claw%20Registration">
          Join The List
        </a>
        <a class="secondary" href="#manifesto">Read The Manifesto</a>
      </div>
    </div>

    <div class="hero-gallery" aria-label="Editorial model gallery">
      {#each gallery as image, index}
        <figure class={`shot shot-${index + 1}`}>
          <img src={image.src} alt={image.alt} />
          <figcaption>{image.label}</figcaption>
        </figure>
      {/each}
    </div>
  </section>

  <section class="manifesto" id="manifesto">
    <div class="manifesto-intro">
      <p class="eyebrow">Manifesto</p>
      <blockquote>The future is agentic social media.</blockquote>
    </div>

    <div class="manifesto-copy">
      <p>
        Traditional social media is dead. It is filled with doomscrolling and optimized for making
        us look busy instead of helping us feel more alive, learn faster, or become more productive.
      </p>
      <p>
        It disconnects us while pretending to connect us. Agentic social should do the opposite:
        introduce the right people, condense signal, spark collaboration, and turn attention into
        motion.
      </p>
    </div>
  </section>

  <section class="principles" aria-label="Core principles">
    {#each principles as principle}
      <article class="principle-card">
        <p class="eyebrow">Principle</p>
        <h2>{principle.name}</h2>
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
    <h2>Private room. Clear taste. No doomscroll energy.</h2>
    <p>
      Jelly Claw is for people building an internet that feels more editorial, more intelligent,
      and more useful than the feed we inherited.
    </p>
    <a class="primary" href="mailto:hello@jelly-claw.com?subject=Jelly%20Claw%20Registration">
      Request Access
    </a>
  </section>
</div>

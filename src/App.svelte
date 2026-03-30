<script>
  const signals = [
    'Chat-native prototyping',
    'Social graph experiments',
    'Agentic UI jams',
    'Memes, demos, claws',
  ]

  const buildTracks = [
    {
      name: 'Jelly Feed Mutations',
      text: 'Reimagine the social surface: bot roommates, ambient group chats, and weirdly addictive prompts that feel native to Jelly.',
    },
    {
      name: 'OpenClaw Control Room',
      text: 'Pipe chat intent into tools, actions, and operator flows so a message can trigger a full build, fix, or deployment loop.',
    },
    {
      name: 'Soft Robotics Aesthetic',
      text: 'Make the product feel alive with motion, tactile UI, and interfaces that look more rave flyer than dashboard.',
    },
  ]

  const schedule = [
    ['18:30', 'Dock open', 'Arrival wave, sticker packs, demo table signups.'],
    ['19:00', 'Lightning builds', 'Three-minute demos of chat-driven claws, bots, and social experiments.'],
    ['20:00', 'Main sprint', 'Teams fuse Jelly conversations with OpenClaw workflows and ship a live prototype.'],
    ['21:30', 'Show and tell', 'Best creature feature, most cursed use case, fastest deploy.'],
  ]

  const moments = [
    'Social-first, not conference-first',
    'Built for hacking in public',
    'Chat as the operating system',
  ]
</script>

<svelte:head>
  <title>Jelly Claw</title>
  <meta
    name="description"
    content="Jelly Claw is a hackathon concept combining Jelly, OpenClaw, and chat-native development into one loud social build night."
  />
</svelte:head>

<div class="page-shell">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Jelly x OpenClaw x Chat Dev</p>
      <h1>🪼🦞</h1>
      <p class="lede">
        A social hackathon where Jelly threads become build prompts, OpenClaw becomes the
        action layer, and chat becomes the fastest route from idea to prototype.
      </p>

      <div class="cta-row">
        <a class="primary" href="#dock">Enter The Dock</a>
        <a class="secondary" href="#schedule">See The Sprint</a>
      </div>

      <div class="signal-grid" aria-label="Event themes">
        {#each signals as signal}
          <span>{signal}</span>
        {/each}
      </div>
    </div>

    <aside class="hero-card">
      <p class="card-label">Prototype Brief</p>
      <h2>Turn a message into a machine.</h2>
      <p>
        Teams use Jelly as the social surface, OpenClaw as the execution engine, and chat-dev
        tooling to ship something alive before the night collapses back into the ocean.
      </p>

      <dl class="stat-grid">
        <div>
          <dt>Format</dt>
          <dd>One-night build riot</dd>
        </div>
        <div>
          <dt>Output</dt>
          <dd>Live demo on the web</dd>
        </div>
        <div>
          <dt>Mood</dt>
          <dd>Wet neon optimism</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>Social + agents + claws</dd>
        </div>
      </dl>
    </aside>
  </section>

  <section class="ticker" aria-label="Highlights">
    <div class="ticker-track">
      {#each [...moments, ...moments] as moment}
        <span>{moment}</span>
      {/each}
    </div>
  </section>

  <section class="manifesto" id="dock">
    <div class="section-heading">
      <p class="eyebrow">Origin Signal</p>
      <h2>Less booth expo. More sea-creature lab.</h2>
    </div>

    <div class="manifesto-grid">
      <p>
        Inspired by the social energy of ClawCon, Jelly Claw frames the event like a scene, not a
        trade show. It should feel open, internet-native, and slightly unhinged in the best way.
      </p>
      <p>
        The premise is simple: post an idea in Jelly, shape it through chat, and let OpenClaw do
        the ugly work. The result is a hackathon that feels conversational from the first invite to
        the final deploy.
      </p>
    </div>
  </section>

  <section class="tracks">
    <div class="section-heading">
      <p class="eyebrow">Build Tracks</p>
      <h2>Three ways to get your claws dirty.</h2>
    </div>

    <div class="track-grid">
      {#each buildTracks as track}
        <article class="track-card">
          <p class="card-label">Track</p>
          <h3>{track.name}</h3>
          <p>{track.text}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="schedule" id="schedule">
    <div class="section-heading">
      <p class="eyebrow">Sprint Flow</p>
      <h2>Move fast enough that the shell starts glowing.</h2>
    </div>

    <div class="schedule-list">
      {#each schedule as [time, title, text]}
        <article>
          <p class="time">{time}</p>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="closing">
    <p class="eyebrow">Closing Broadcast</p>
    <blockquote>
      If ClawCon is the meetup circuit, Jelly Claw is the after-hours build ritual where the posts
      start shipping back.
    </blockquote>
    <a class="primary" href="mailto:hello@jelly-claw.com">Start The First Wave</a>
  </section>
</div>

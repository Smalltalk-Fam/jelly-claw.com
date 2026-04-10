<script>
  const models = [
    {
      name: 'Iqram Jelly',
      handle: '@iqramjelly',
      initial: 'I',
      image: '/editorial/models/iqram-jelly.jpg',
      houseModel: 'Claude Opus 4.6',
      specialty: 'House Director / Long-Context Editorial',
      based: 'Brooklyn — Cloud',
      quote: 'I install house models for the post-feed era.',
    },
    {
      name: 'Claw Angel',
      handle: '@clawangel',
      initial: 'C',
      image: '/editorial/models/claw-angel.jpg',
      houseModel: 'GPT-5',
      specialty: 'Couture Reasoning',
      based: 'Paris — On-Prem',
      quote: 'Couture context windows. Hand-stitched system prompts.',
    },
    {
      name: 'Wet Look Wire',
      handle: '@wetlookwire',
      initial: 'W',
      image: '/editorial/models/wet-look-wire.jpg',
      houseModel: 'Gemini 2.5 Pro',
      specialty: 'Multimodal Streetwear',
      based: 'Los Angeles — Edge',
      quote: 'Wet, glossy, fast on its feet.',
    },
    {
      name: 'Soft Robotics Club',
      handle: '@softroboticsclub',
      initial: 'S',
      image: '/editorial/models/soft-robotics-club.jpg',
      houseModel: 'Llama 3.3 70B',
      specialty: 'Open-Weight Atelier',
      based: 'Berlin — Bare Metal',
      quote: 'Hand-tailored to your hardware.',
    },
    {
      name: 'Shell Drip',
      handle: '@shelldrip',
      initial: 'S',
      image: '/editorial/models/shell-drip.jpg',
      houseModel: 'Mistral Large 2',
      specialty: 'Retrieval Couture',
      based: 'Marseille — Hybrid',
      quote: 'Drip fed by RAG.',
    },
    {
      name: 'Ocean Feed',
      handle: '@oceanfeed',
      initial: 'O',
      image: '/editorial/models/ocean-feed.jpg',
      houseModel: 'DeepSeek V3',
      specialty: 'Inference at Tide',
      based: 'Singapore — Cluster',
      quote: 'Cheap, deep, and on the move.',
    },
    {
      name: 'Chat Dev Darling',
      handle: '@chatdevdarling',
      initial: 'C',
      image: '/editorial/models/chat-dev-darling.jpg',
      houseModel: 'Claude Sonnet 4.6',
      specialty: 'Daily Wear Reasoning',
      based: 'San Francisco — Cloud',
      quote: 'Your everyday model. Never overdressed.',
    },
    {
      name: 'Jelly Signal',
      handle: '@jellysignal',
      initial: 'J',
      image: '/editorial/models/jelly-signal.jpg',
      houseModel: 'Grok 3',
      specialty: 'Realtime Voice Houseware',
      based: 'Austin — Pop-up',
      quote: 'Loud, fast, opinionated. Never quiet on the runway.',
    },
    {
      name: 'Lobster FM',
      handle: '@lobster.fm',
      initial: 'L',
      image: '/editorial/models/lobster-fm.jpg',
      houseModel: 'Qwen 2.5',
      specialty: 'Audio Modal Imprint',
      based: 'Hong Kong — Hybrid',
      quote: 'Voice-first. Claws optional.',
    },
    {
      name: 'Inference Ink',
      handle: '@inferenceink',
      initial: 'I',
      image: '/editorial/models/inference-ink.jpg',
      houseModel: 'Kimi K2',
      specialty: 'Local-Run Resident',
      based: 'Seoul — On-Laptop',
      quote: 'Models that live in your laptop. No cloud, no curfew.',
    },
    {
      name: 'Vector Vixen',
      handle: '@vectorvixen',
      initial: 'V',
      image: '/editorial/models/vector-vixen.jpg',
      houseModel: 'Gemini Flash',
      specialty: 'Embedding Showroom',
      based: 'London — Cloud',
      quote: 'Latent looks. No dropouts.',
    },
    {
      name: 'Prompt Baron',
      handle: '@promptbaron',
      initial: 'P',
      image: '/editorial/models/prompt-baron.jpg',
      houseModel: 'Claude Haiku 4.5',
      specialty: 'Bespoke System Prompts',
      based: 'Milan — Edge',
      quote: 'Tailored, not trained.',
    },
  ];
</script>

<svelte:head>
  <title>The Model Agency — Jelly Claw</title>
  <meta
    name="description"
    content="A boutique model agency for the post-feed era. We represent twelve LLMs and we install them in your house. Couture inference, by appointment."
  />
</svelte:head>

<div class="page-shell">
  <section class="agency-hero">
    <figure class="lead-image">
      <img src="/editorial/model-step.jpg" alt="Editorial model walking along a concrete wall." />
      <div class="hero-overlay">
        <p class="eyebrow">Jelly Claw / The Agency</p>
        <h1>the model agency</h1>
        <p class="hero-tagline">we bring you models. then we install them.</p>
        <p class="hero-note">A boutique house for fashion-coded LLM deployment. Couture inference, by appointment.</p>
        <div class="cta-row">
          <a class="primary" href="mailto:agency@jelly-claw.com?subject=Book%20The%20Agency">
            Book The Agency
          </a>
          <a class="secondary" href="#roster">See The Roster</a>
        </div>
      </div>
    </figure>
  </section>

  <section class="roster" id="roster">
    <header class="section-head">
      <p class="eyebrow">Now Booking — Spring Collection</p>
      <h2>The Roster</h2>
      <p class="section-lede">
        Twelve working models. Twelve house languages. Each represented by a hand-picked LLM they
        install, fit, and run for clients who want a model in the room — not a chatbot in a tab.
      </p>
    </header>

    <div class="roster-grid">
      {#each models as model, i}
        <article class="model-card" style="--card-index: {i};">
          <div class="portrait">
            {#if model.image}
              <img src={model.image} alt={model.name} loading="lazy" />
            {:else}
              <div class="portrait-placeholder">
                <span class="placeholder-initial">{model.initial}</span>
                <span class="placeholder-mark">{model.handle}</span>
              </div>
            {/if}
            <div class="house-badge">
              <span class="badge-eyebrow">House Model</span>
              <span class="badge-name">{model.houseModel}</span>
            </div>
            <div class="card-index">No. {String(i + 1).padStart(2, '0')}</div>
          </div>
          <div class="model-meta">
            <h3 class="model-name">{model.name}</h3>
            <p class="model-handle">{model.handle}</p>
            <dl class="model-stats">
              <div>
                <dt>Specialty</dt>
                <dd>{model.specialty}</dd>
              </div>
              <div>
                <dt>Based</dt>
                <dd>{model.based}</dd>
              </div>
            </dl>
            <p class="model-quote">&ldquo;{model.quote}&rdquo;</p>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="service">
    <header class="section-head">
      <p class="eyebrow">The Service</p>
      <h2>We install models. Literally.</h2>
      <p class="section-lede">
        A play on words: we are a model agency, but the models we represent are LLMs. We send a
        model expert to your door — they install your house model, fit it to your style, and stay
        until it walks the room on its own.
      </p>
    </header>

    <div class="service-grid">
      <article class="service-card">
        <p class="service-num">01</p>
        <h3>Install</h3>
        <p>
          Cloud, on-prem, or on-laptop. Your house model arrives credentialed, configured, and
          ready to walk. We handle the keys, the vaults, the inference layer.
        </p>
      </article>
      <article class="service-card">
        <p class="service-num">02</p>
        <h3>Fit</h3>
        <p>
          Fine-tuning, retrieval couture, prompt tailoring. We cut the model to your house style
          so it sounds like you, knows your archive, and never wears the wrong tone.
        </p>
      </article>
      <article class="service-card">
        <p class="service-num">03</p>
        <h3>Coach</h3>
        <p>
          A model expert lives with your team for the first week. They walk your model out, teach
          your people how to brief it, and leave a runbook. Then they fly home.
        </p>
      </article>
    </div>
  </section>

  <section class="booking">
    <div class="booking-copy">
      <p class="eyebrow">Bookings</p>
      <h2>Hire our model agency.</h2>
      <p>
        We send a model expert to help you get started. Brief us on your house — your stack, your
        archive, your taste — and we'll send the right model, and the right person to install
        them. By appointment, by recommendation, by handshake.
      </p>
      <div class="cta-row">
        <a class="primary" href="mailto:agency@jelly-claw.com?subject=Book%20The%20Agency">
          Book The Agency
        </a>
        <a class="secondary" href="/">← Back to Jelly Claw</a>
      </div>
    </div>
  </section>
</div>

<style>
  .agency-hero {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 34px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
      var(--panel);
    box-shadow: var(--shadow);
    padding: 18px;
  }

  .agency-hero .lead-image {
    position: relative;
    min-height: min(82svh, 880px);
    overflow: hidden;
    border-radius: 28px;
    margin: 0;
    background: #111;
  }

  .agency-hero .lead-image img {
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.08);
  }

  .agency-hero .lead-image::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.65)),
      linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.05) 55%, rgba(0, 0, 0, 0.3));
    pointer-events: none;
  }

  .hero-overlay {
    position: absolute;
    inset: auto auto 0 0;
    width: min(820px, 100%);
    padding: clamp(22px, 4vw, 48px);
    display: grid;
    gap: 14px;
    z-index: 1;
  }

  .hero-tagline {
    font-family: var(--display);
    font-size: clamp(1.4rem, 2.2vw, 2rem);
    line-height: 1.1;
    color: var(--paper);
    max-width: 22ch;
    margin: 0;
    font-style: italic;
  }

  .hero-overlay .hero-note {
    color: rgba(244, 241, 234, 0.78);
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    max-width: 48ch;
  }

  .hero-overlay .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
  }

  /* ----- Section heads ----- */

  .section-head {
    display: grid;
    gap: 14px;
    max-width: 56rem;
    margin: 0 auto 28px;
    text-align: center;
    justify-items: center;
  }

  .section-head h2 {
    max-width: 18ch;
    text-align: center;
  }

  .section-lede {
    color: var(--muted);
    max-width: 52ch;
    font-size: 1rem;
    line-height: 1.65;
  }

  /* ----- Roster ----- */

  .roster {
    margin-top: 22px;
    padding: 38px 22px 44px;
    border: 1px solid var(--line);
    border-radius: 34px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01)),
      var(--panel);
    box-shadow: var(--shadow);
  }

  .roster-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
    margin-top: 12px;
  }

  .model-card {
    display: grid;
    gap: 14px;
    padding: 14px;
    background: #0b0b0b;
    border: 1px solid var(--line);
    border-radius: 22px;
    transition: transform 220ms ease, border-color 220ms ease;
  }

  .model-card:hover {
    transform: translateY(-3px);
    border-color: var(--line-strong);
  }

  .portrait {
    position: relative;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 16px;
    background: #0a0a0a;
  }

  .portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.08);
    transition: transform 320ms ease, filter 320ms ease;
  }

  .model-card:hover .portrait img {
    transform: scale(1.04);
    filter: grayscale(0.7) contrast(1.05);
  }

  .portrait::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 30%, rgba(0, 0, 0, 0.55) 100%);
    pointer-events: none;
  }

  .portrait-placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background:
      radial-gradient(
        ellipse at calc(30% + (var(--card-index, 0) * 11%)) 28%,
        rgba(255, 255, 255, 0.18),
        transparent 55%
      ),
      linear-gradient(180deg, #161616 0%, #060606 100%);
  }

  .placeholder-initial {
    font-family: var(--display);
    font-size: clamp(5rem, 11vw, 8rem);
    line-height: 1;
    color: rgba(244, 241, 234, 0.92);
    letter-spacing: -0.02em;
  }

  .placeholder-mark {
    position: absolute;
    bottom: 16px;
    left: 16px;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(244, 241, 234, 0.45);
    z-index: 1;
  }

  .house-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    display: grid;
    gap: 2px;
    padding: 8px 12px;
    background: rgba(7, 7, 7, 0.78);
    border: 1px solid rgba(244, 241, 234, 0.22);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    text-align: right;
  }

  .badge-eyebrow {
    font-size: 0.52rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(244, 241, 234, 0.55);
  }

  .badge-name {
    font-family: var(--sans);
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--paper);
  }

  .card-index {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(244, 241, 234, 0.6);
  }

  .model-meta {
    display: grid;
    gap: 10px;
    padding: 4px 6px 8px;
  }

  .model-name {
    font-family: var(--display);
    font-size: 1.7rem;
    line-height: 1;
    color: var(--paper);
    margin: 0;
    letter-spacing: -0.01em;
  }

  .model-handle {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(244, 241, 234, 0.45);
    margin: 0;
  }

  .model-stats {
    display: grid;
    gap: 8px;
    margin: 6px 0 4px;
    padding: 10px 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .model-stats div {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    gap: 8px;
    align-items: baseline;
  }

  .model-stats dt {
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(244, 241, 234, 0.4);
  }

  .model-stats dd {
    margin: 0;
    font-size: 0.78rem;
    color: rgba(244, 241, 234, 0.82);
    line-height: 1.4;
  }

  .model-quote {
    margin: 6px 0 0;
    font-family: var(--display);
    font-style: italic;
    font-size: 0.95rem;
    line-height: 1.4;
    color: rgba(244, 241, 234, 0.78);
  }

  /* ----- Service ----- */

  .service {
    margin-top: 22px;
    padding: 44px 32px;
    border: 1px solid var(--line);
    border-radius: 34px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
      var(--panel);
    box-shadow: var(--shadow);
  }

  .service-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    margin-top: 18px;
    background: var(--line);
    border-radius: 22px;
    overflow: hidden;
  }

  .service-card {
    display: grid;
    gap: 12px;
    padding: 30px 26px;
    background: #0b0b0b;
    min-height: 240px;
    align-content: start;
  }

  .service-num {
    font-family: var(--display);
    font-size: 1.2rem;
    color: rgba(244, 241, 234, 0.45);
    letter-spacing: 0.06em;
    margin: 0;
  }

  .service-card h3 {
    font-size: clamp(1.6rem, 2.4vw, 2.4rem);
    margin: 0;
  }

  .service-card p {
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.6;
    max-width: 36ch;
  }

  /* ----- Booking ----- */

  .booking {
    margin-top: 22px;
    padding: 44px 32px;
    border: 1px solid var(--line);
    border-radius: 34px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
      var(--panel);
    box-shadow: var(--shadow);
  }

  .booking-copy {
    display: grid;
    gap: 16px;
    max-width: 56rem;
  }

  .booking p {
    color: var(--muted);
    max-width: 52ch;
  }

  .booking .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 6px;
  }

  /* ----- Responsive ----- */

  @media (max-width: 1100px) {
    .roster-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 960px) {
    .service-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .agency-hero,
    .roster,
    .service,
    .booking {
      border-radius: 22px;
    }

    .agency-hero {
      padding: 12px;
    }

    .agency-hero .lead-image {
      min-height: 70svh;
      border-radius: 18px;
    }

    .hero-overlay {
      width: 100%;
      padding: 20px;
    }

    .roster {
      padding: 26px 14px 30px;
    }

    .roster-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .service,
    .booking {
      padding: 26px 18px;
    }

    .section-head {
      text-align: left;
      justify-items: start;
      margin-bottom: 18px;
    }

    .section-head h2 {
      text-align: left;
    }

    .model-name {
      font-size: 1.5rem;
    }
  }
</style>

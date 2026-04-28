<script>
  const templates = [
    {
      name: 'jelly-as-tweet',
      title: 'Jelly as Tweet',
      description: 'Turn any jelly into a shareable tweet-style card.',
      preview: '#1a6bff',
    },
  ];
</script>

<svelte:head>
  <title>Templates — Jelly Claw</title>
  <meta name="description" content="Jelly Claw templates for generating shareable content from your jellies." />
</svelte:head>

<div class="templates-page">
  <header class="templates-header">
    <p class="eyebrow">Templates</p>
    <h1>Generate shareable content from your jellies.</h1>
    <p class="subtitle">Paste a jelly, pick a template, get something you can share.</p>
  </header>

  <div class="template-grid">
    {#each templates as t}
      <a class="template-card" href="/templates/{t.name}">
        <div class="template-preview" style="background: {t.preview};">
          <div class="preview-inner">
            <span class="preview-text">Aa</span>
          </div>
        </div>
        <div class="template-info">
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .templates-page {
    min-height: 100vh;
    color: #f4f1ea;
    padding: 3rem 1.5rem;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Montserrat', sans-serif;
  }

  .templates-header {
    margin-bottom: 3rem;
  }

  .templates-header h1 {
    font-family: 'Forum', serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0.5rem 0;
    max-width: 14ch;
  }

  .subtitle {
    color: rgba(244, 241, 234, 0.5);
    font-size: 0.9rem;
    margin: 0;
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }

  .template-card {
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    overflow: hidden;
    background: #0f0f0f;
    transition: border-color 180ms ease, transform 180ms ease;
  }

  .template-card:hover {
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .template-preview {
    aspect-ratio: 16 / 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .preview-inner {
    background: rgba(0, 0, 0, 0.25);
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 16px 24px;
    width: 70%;
  }

  .preview-text {
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Forum', serif;
    font-size: 1.2rem;
  }

  .template-info {
    padding: 16px 20px 20px;
  }

  .template-info h2 {
    font-family: 'Forum', serif;
    font-size: 1.2rem;
    font-weight: 400;
    margin: 0 0 0.3rem;
  }

  .template-info p {
    color: rgba(244, 241, 234, 0.45);
    font-size: 0.8rem;
    margin: 0;
  }
</style>

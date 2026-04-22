<svelte:head>
	<title>Download Jelly-Claw</title>
	<meta name="description" content="Download Jelly-Claw for macOS." />
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="hero-left">
			<div class="logo">
				<img src="/jellyfish.png" alt="" class="logo-icon" />
				<span class="logo-text">Jelly-Claw</span>
			</div>

			<h1>Install Jelly-Claw<br />in 3 steps:</h1>

			<ol class="steps">
				<li>Open your <strong>Downloads</strong></li>
				<li>Double-click <strong>Jelly-Claw.dmg</strong></li>
				<li>Drag to <strong>Applications</strong> — then launch from the menu bar</li>
			</ol>

<a href="/Jelly-Claw.dmg" download class="download-btn">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				Download for macOS
			</a>
			<p class="version">v1.8.3 · 3.9 MB · macOS 12+ · Intel + Apple Silicon</p>
			<p class="agree">By downloading, you agree to our <a href="/terms" target="_blank" rel="noopener">Terms of Service</a>.</p>
			<a href="/download/changelog" target="_blank" rel="noopener" class="changelog-link">Changelog &rarr;</a>
		</div>

		<div class="hero-right">
			<div class="mockup">
				<div class="mockup-bar">
					<span class="dot red"></span>
					<span class="dot yellow"></span>
					<span class="dot green"></span>
					<span class="mockup-title">Jelly-Claw</span>
				</div>
				<div class="mockup-body">
					<div class="mockup-icon">
						<img src="/jellyfish.png" alt="Jelly-Claw" />
					</div>
					<svg class="mockup-arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
					<div class="mockup-folder">
						<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
						<span>Applications</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="footer">
		<a href="/">jelly-claw.com</a>
		<span class="footer-sep">&middot;</span>
		<a href="/terms" target="_blank" rel="noopener">Terms of Service</a>
		<span class="footer-sep">&middot;</span>
		<a href="/privacy" target="_blank" rel="noopener">Privacy</a>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #070707;
		color: #f4f1ea;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
	}

	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 90vh;
		border: none;
		border-radius: 0;
		box-shadow: none;
		background: none;
	}

	.hero-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 5rem 4rem 4rem;
		gap: 2rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.logo-icon {
		width: 32px;
		height: 32px;
	}
	.logo-text {
		font-family: 'Forum', serif;
		font-size: 1.2rem;
		letter-spacing: 0.02em;
		color: #f4f1ea;
	}

	h1 {
		font-family: 'Forum', serif;
		font-size: clamp(2.4rem, 4vw, 3.8rem);
		font-weight: 400;
		line-height: 1.08;
		letter-spacing: -0.02em;
		margin: 0;
		color: #f4f1ea;
	}

	.steps {
		list-style: none;
		counter-reset: step;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.steps li {
		counter-increment: step;
		font-size: 1.05rem;
		color: rgba(244, 241, 234, 0.85);
		line-height: 1.5;
	}
	.steps li::before {
		content: counter(step) ". ";
		color: rgba(244, 241, 234, 0.45);
		font-weight: 600;
	}
	.steps strong {
		color: #f4f1ea;
		font-weight: 600;
	}

	.blocked-note {
		font-size: 0.82rem;
		color: rgba(244, 241, 234, 0.45);
		line-height: 1.6;
		margin: 0;
		padding: 1rem 1.2rem;
		background: rgba(244, 241, 234, 0.03);
	}
	.blocked-note strong {
		color: rgba(244, 241, 234, 0.8);
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: 10px;
		padding: 14px 32px;
		background: #f4f1ea;
		color: #070707;
		text-decoration: none;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		border-radius: 999px;
		transition: transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 4px 24px rgba(244, 241, 234, 0.15);
	}
	.download-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(244, 241, 234, 0.25);
	}

	.version {
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.3);
		letter-spacing: 0.08em;
		margin: 0;
	}

	.agree {
		font-size: 0.68rem;
		color: rgba(244, 241, 234, 0.25);
		margin: 0;
	}
	.agree a {
		color: rgba(244, 241, 234, 0.4);
		text-decoration: underline;
	}
	.agree a:hover {
		color: rgba(244, 241, 234, 0.6);
	}

	.changelog-link {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.35);
		text-decoration: none;
		letter-spacing: 0.04em;
		margin-top: -1rem;
	}
	.changelog-link:hover { color: rgba(244, 241, 234, 0.6); }

	.hero-right {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rem 3rem;
		background:
			radial-gradient(circle at 70% 30%, rgba(244, 241, 234, 0.04), transparent 50%),
			#0a0a0a;
		border-left: 1px solid rgba(244, 241, 234, 0.06);
	}

	.mockup {
		width: 360px;
		overflow: hidden;
		box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
		border: none;
		border-radius: 0;
	}
	.mockup-bar {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 12px 16px;
		background: #1a1a1a;
		border-bottom: 1px solid rgba(244, 241, 234, 0.06);
	}
	.mockup-bar .dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.mockup-bar .red { background: #ff5f57; }
	.mockup-bar .yellow { background: #febc2e; }
	.mockup-bar .green { background: #28c840; }
	.mockup-title {
		margin-left: auto;
		margin-right: auto;
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.55);
		letter-spacing: 0.06em;
		font-weight: 500;
	}

	.mockup-body {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		padding: 3.5rem 2rem;
		background: #111;
	}

	.mockup-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mockup-icon img {
		width: 72px;
		height: 72px;
		filter: grayscale(1) brightness(1.15) contrast(0.95);
		opacity: 0.85;
	}

	.mockup-arrow {
		color: rgba(244, 241, 234, 0.25);
	}

	.mockup-folder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		color: rgba(244, 241, 234, 0.55);
	}
	.mockup-folder span {
		font-size: 0.68rem;
		letter-spacing: 0.03em;
	}

	.footer {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}
	.footer a {
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.25);
		text-decoration: none;
		letter-spacing: 0.06em;
	}
	.footer a:hover { color: rgba(244, 241, 234, 0.5); }
	.footer-sep {
		color: rgba(244, 241, 234, 0.15);
	}

	@media (max-width: 860px) {
		.hero {
			grid-template-columns: 1fr;
			min-height: auto;
		}
		.hero-left {
			padding: 3rem 1.5rem 2rem;
		}
		.hero-right {
			border-left: none;
			border-top: 1px solid rgba(244, 241, 234, 0.06);
			padding: 2.5rem 1.5rem;
		}
		.mockup { width: 100%; max-width: 340px; }
		h1 { font-size: 2.2rem; }
	}
</style>

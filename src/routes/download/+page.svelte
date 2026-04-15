<script>
	function startCall(kind) {
		const id =
			typeof crypto !== 'undefined' && 'randomUUID' in crypto
				? crypto.randomUUID()
				: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
		const prefix =
			kind === 'one-on-one' ? '/call/' : kind === 'group' ? '/room/' : '/voice/';
		window.location.href = `${prefix}${id}`;
	}
</script>

<svelte:head>
	<title>Download Jelly-Claw</title>
	<meta name="description" content="Download Jelly-Claw for macOS — video calling, audio recording, and podcast clipping for Jelly users." />
</svelte:head>

<div class="page">
	<!-- ── Hero: split layout ── -->
	<section class="hero">
		<div class="hero-left">
			<div class="logo">
				<img src="/jellyfish.png" alt="" class="logo-icon" />
				<span class="logo-text">Jelly-Claw</span>
			</div>

			<h1>Open Jelly-Claw<br />in 3 steps:</h1>

			<ol class="steps">
				<li>Open your <strong>Downloads</strong></li>
				<li>Double-click <strong>Jelly-Claw.dmg</strong></li>
				<li>Drag to <strong>Applications</strong> — then launch from the menu bar</li>
			</ol>

			<p class="blocked-note">
				macOS blocks the first launch.<br />
				Go to <strong>System Settings &rarr; Privacy &amp; Security &rarr; Open Anyway</strong>.
			</p>

			<a href="/Jelly-Claw.dmg" download class="download-btn">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				Download for macOS
			</a>
			<p class="version">v1.4.0 · 3.0 MB · macOS 12+ · Apple Silicon</p>
		</div>

		<div class="hero-right">
			<!-- Stylised "DMG window" mockup -->
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

	<!-- ── Features ── -->
	<section class="features">
		<div class="feature">
			<span class="feat-icon">📹</span>
			<div>
				<h3>Video Calling</h3>
				<p>1:1 calls free forever. Group calls with up to 8 people + unlimited live spectators.</p>
			</div>
		</div>
		<div class="feature">
			<span class="feat-icon">🎙</span>
			<div>
				<h3>Voice Rooms</h3>
				<p>Audio-only rooms with live listeners. Record and post directly as a Jelly.</p>
			</div>
		</div>
		<div class="feature">
			<span class="feat-icon">🎵</span>
			<div>
				<h3>Audio Capture</h3>
				<p>Always-on 5-minute audio buffer. Clip and save the last thing you heard.</p>
			</div>
		</div>
		<div class="feature">
			<span class="feat-icon">🪼</span>
			<div>
				<h3>Jelly Integration</h3>
				<p>Post clips, send DMs, browse contacts — all from your menu bar.</p>
			</div>
		</div>
	</section>

	<!-- ── Start a call from the browser ── -->
	<section class="browser-calls">
		<p class="eyebrow">OR START A CALL RIGHT FROM THE BROWSER</p>
		<div class="call-options">
			<button class="call-option" on:click={() => startCall('one-on-one')}>
				<span class="option-title">1:1 CALL</span>
				<span class="option-sub">just you and one other · free</span>
			</button>
			<button class="call-option" on:click={() => startCall('group')}>
				<span class="option-title">GROUP CALL</span>
				<span class="option-sub">up to 8 · live video spectators</span>
			</button>
			<button class="call-option" on:click={() => startCall('voice')}>
				<span class="option-title">VOICE ROOM</span>
				<span class="option-sub">up to 8 · live audio listeners</span>
			</button>
		</div>
	</section>

	<!-- ── What's new ── -->
	<section class="changelog">
		<h4>What's new in v1.4.0</h4>
		<ul>
			<li>Quick Jelly: double-tap J anywhere to record, spacebar to post as unlisted Jelly</li>
			<li>Build Your Jelly Fam: new onboarding with relationship types</li>
			<li>Genie follow-ups: reply in wish rooms and Genie responds with context</li>
			<li>All Genie updates stream to Jelly Chat in real-time</li>
			<li>Dispatch persistence: wishes survive server restarts</li>
			<li>Endless recording, deep links, copy feedback, session expiry banner</li>
			<li>3 free wishes, 30 for Wobbles holders, then subscribe</li>
		</ul>
		<a href="/download/changelog" class="link">Full changelog &rarr;</a>
	</section>

	<!-- ── Footer ── -->
	<div class="footer">
		<a href="/">jelly-claw.com</a>
		<span class="dot-sep">·</span>
		<a href="/download/archives">Older versions</a>
		<span class="dot-sep">·</span>
		<a href="/pricing">Pricing</a>
	</div>
</div>

<style>
	/* ── Reset + base ── */
	.page {
		min-height: 100vh;
		background: #070707;
		color: #f4f1ea;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
	}

	/* ── Hero: split ── */
	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 90vh;
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
		filter: brightness(0) invert(1);
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
		border: 1px solid rgba(244, 241, 234, 0.08);
		border-radius: 10px;
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

	/* ── Hero right: mockup ── */
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
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(244, 241, 234, 0.08) inset;
		border: 1px solid rgba(244, 241, 234, 0.1);
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
		width: 80px;
		height: 80px;
		border-radius: 18px;
		background: #1a1a1a;
		border: 1px solid rgba(244, 241, 234, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	}
	.mockup-icon img {
		width: 52px;
		height: 52px;
		filter: brightness(0) invert(1);
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

	/* ── Features ── */
	.features {
		max-width: 700px;
		margin: 0 auto;
		padding: 4rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.feature {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem 1.2rem;
		background: rgba(244, 241, 234, 0.02);
		border: 1px solid rgba(244, 241, 234, 0.06);
		border-radius: 10px;
	}

	.feat-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
		width: 36px;
		text-align: center;
	}

	.feature h3 {
		font-size: 0.88rem;
		font-weight: 600;
		margin: 0 0 0.2rem;
		color: #f4f1ea;
	}

	.feature p {
		font-size: 0.78rem;
		color: rgba(244, 241, 234, 0.5);
		margin: 0;
		line-height: 1.4;
	}

	/* ── Browser calls ── */
	.browser-calls {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 2rem 4rem;
		text-align: center;
	}

	.eyebrow {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: rgba(244, 241, 234, 0.4);
		margin: 0 0 1.2rem;
	}

	.call-options {
		display: grid;
		gap: 0.5rem;
	}

	.call-option {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		padding: 14px 20px;
		background: rgba(244, 241, 234, 0.02);
		border: 1px solid rgba(244, 241, 234, 0.08);
		border-radius: 10px;
		color: #f4f1ea;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}
	.call-option:hover {
		background: rgba(244, 241, 234, 0.06);
		border-color: rgba(244, 241, 234, 0.2);
		transform: translateY(-1px);
	}
	.option-title {
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.18em;
	}
	.option-sub {
		font-size: 0.7rem;
		color: rgba(244, 241, 234, 0.4);
		letter-spacing: 0.04em;
	}

	/* ── Changelog ── */
	.changelog {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 2rem 4rem;
	}

	.changelog h4 {
		font-size: 0.8rem;
		font-weight: 600;
		margin: 0 0 0.8rem;
		color: rgba(244, 241, 234, 0.6);
	}

	.changelog ul {
		margin: 0;
		padding-left: 0;
		list-style: none;
	}
	.changelog li {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.45);
		line-height: 1.7;
		padding-left: 1rem;
		position: relative;
	}
	.changelog li::before {
		content: '·';
		position: absolute;
		left: 0;
		color: rgba(244, 241, 234, 0.25);
		font-weight: 700;
	}

	.link {
		display: inline-block;
		margin-top: 0.8rem;
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.4);
		text-decoration: none;
		letter-spacing: 0.04em;
	}
	.link:hover { color: rgba(244, 241, 234, 0.7); }

	/* ── Footer ── */
	.footer {
		display: flex;
		justify-content: center;
		gap: 0.6rem;
		align-items: center;
		padding: 2rem;
	}
	.footer a {
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.25);
		text-decoration: none;
		letter-spacing: 0.06em;
	}
	.footer a:hover { color: rgba(244, 241, 234, 0.5); }
	.dot-sep { color: rgba(244, 241, 234, 0.15); }

	/* ── Mobile ── */
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

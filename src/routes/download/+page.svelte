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

<div class="download-page">
	<div class="hero">
		<img src="/jellyfish.png" alt="Jelly-Claw" class="icon" />
		<h1>Jelly-Claw</h1>
		<p class="tagline">video calls. podcast clips. agentic social media.</p>
	</div>

	<a href="/Jelly-Claw.dmg" download class="download-btn">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
			<polyline points="7 10 12 15 17 10"></polyline>
			<line x1="12" y1="15" x2="12" y2="3"></line>
		</svg>
		Download for macOS
	</a>
	<p class="version">v1.2.0 · 3.0 MB · macOS 12+ · Apple Silicon</p>
	<a href="/pricing" class="pricing-link">See pricing →</a>

	<div class="features">
		<div class="feature">
			<span class="feat-icon">📹</span>
			<div>
				<h3>Video Calling</h3>
				<p>FaceTime-style 1:1 calls. Share a link, anyone joins from their browser.</p>
			</div>
		</div>
		<div class="feature">
			<span class="feat-icon">🎙</span>
			<div>
				<h3>Podcast Recording</h3>
				<p>Record calls in Full A/V, guest-only, or audio-only. Post directly as a Jelly.</p>
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
	</div>

	<div class="start-a-call">
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
	</div>

	<div class="install-note">
		<h4>First launch</h4>
		<p>Since this app isn't from the App Store, macOS may block it. Right-click the app → Open → click Open again. You only need to do this once.</p>
	</div>

	<div class="install-note">
		<h4>Updating from a previous version?</h4>
		<p>Quit the existing Jelly-Claw from your menu bar (right-click the jellyfish icon → Quit), then drag the new version to Applications. It will replace the old one. Your account stays signed in.</p>
	</div>

	<div class="changelog">
		<h4>What's new in v1.2.0</h4>
		<ul>
			<li>Phone sign-up: country code picker with flags (defaults to US +1)</li>
			<li>Auto-focus inputs and auto-verify OTP on 6 digits</li>
			<li>Fixed DM and group chat invite delivery</li>
			<li>Contacts sidebar during calls — invite people with one tap</li>
			<li>Guest rejoin: call links stay active after someone leaves</li>
			<li>Deep link support (jellyclaw:// URLs open in the app)</li>
			<li>Profile loads on launch (fixes "Not signed in" in settings)</li>
			<li>Recording saves to per-call folders with video, audio, and thumbnail</li>
			<li>1:1 call page rejoin button in the browser</li>
		</ul>
	</div>

	<div class="footer">
		<a href="/">jelly-claw.com</a>
	</div>
</div>

<style>
	.download-page {
		min-height: 100vh;
		background: #070707;
		color: #f4f1ea;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 4rem 1.5rem;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
	}

	.hero {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.icon {
		width: 120px;
		height: 120px;
		margin-bottom: 1.5rem;
		filter: drop-shadow(0 8px 32px rgba(56, 152, 236, 0.3));
	}

	h1 {
		font-family: 'Forum', serif;
		font-size: 2.8rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		margin: 0 0 0.5rem;
	}

	.tagline {
		font-size: 0.95rem;
		color: rgba(244, 241, 234, 0.5);
		letter-spacing: 0.05em;
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 14px 32px;
		background: linear-gradient(135deg, #1a6cd4, #3898ec);
		color: #fff;
		text-decoration: none;
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		border-radius: 14px;
		transition: transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 4px 24px rgba(56, 152, 236, 0.3);
	}

	.download-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(56, 152, 236, 0.5);
	}

	.version {
		margin-top: 0.8rem;
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.3);
		letter-spacing: 0.08em;
	}

	.pricing-link {
		display: inline-block;
		margin-top: 1rem;
		font-size: 0.8rem;
		color: rgba(56, 152, 236, 0.9);
		text-decoration: none;
		letter-spacing: 0.03em;
		transition: color 0.2s;
	}

	.pricing-link:hover {
		color: rgba(56, 152, 236, 1);
	}

	.features {
		margin-top: 3.5rem;
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.feature {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.06);
		border-radius: 12px;
	}

	.feat-icon {
		font-size: 1.6rem;
		flex-shrink: 0;
		width: 36px;
		text-align: center;
	}

	.feature h3 {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0 0 0.2rem;
		color: #f4f1ea;
	}

	.feature p {
		font-size: 0.8rem;
		color: rgba(244, 241, 234, 0.5);
		margin: 0;
		line-height: 1.4;
	}

	.start-a-call {
		margin-top: 3rem;
		max-width: 520px;
		width: 100%;
		text-align: center;
	}

	.start-a-call .eyebrow {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: rgba(244, 241, 234, 0.45);
		margin: 0 0 1rem;
	}

	.call-options {
		display: grid;
		gap: 0.6rem;
	}

	.call-option {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
		padding: 14px 20px;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.12);
		border-radius: 14px;
		color: #f4f1ea;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}

	.call-option:hover {
		background: rgba(56, 152, 236, 0.08);
		border-color: rgba(56, 152, 236, 0.35);
		transform: translateY(-2px);
	}

	.call-option .option-title {
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.18em;
	}

	.call-option .option-sub {
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.45);
		letter-spacing: 0.04em;
	}

	.install-note {
		margin-top: 3rem;
		max-width: 500px;
		width: 100%;
		padding: 1rem 1.2rem;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.08);
		border-radius: 10px;
	}

	.install-note h4 {
		font-size: 0.8rem;
		font-weight: 600;
		margin: 0 0 0.4rem;
		color: rgba(244, 241, 234, 0.7);
	}

	.install-note p {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.4);
		margin: 0;
		line-height: 1.5;
	}

	.install-note + .install-note {
		margin-top: 1rem;
	}

	.changelog {
		margin-top: 2rem;
		max-width: 500px;
		width: 100%;
		padding: 1rem 1.2rem;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.08);
		border-radius: 10px;
	}

	.changelog h4 {
		font-size: 0.8rem;
		font-weight: 600;
		margin: 0 0 0.6rem;
		color: rgba(244, 241, 234, 0.7);
	}

	.changelog ul {
		margin: 0;
		padding-left: 1.2rem;
		list-style: none;
	}

	.changelog li {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.45);
		line-height: 1.7;
		position: relative;
	}

	.changelog li::before {
		content: '·';
		position: absolute;
		left: -0.9rem;
		color: rgba(56, 152, 236, 0.7);
		font-weight: 700;
	}

	.footer {
		margin-top: 3rem;
	}

	.footer a {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.25);
		text-decoration: none;
		letter-spacing: 0.06em;
	}

	.footer a:hover { color: rgba(244, 241, 234, 0.5); }
</style>

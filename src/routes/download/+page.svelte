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
	<p class="version">v1.3.0 · 3.0 MB · macOS 12+ · Apple Silicon</p>
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

	<div class="install-guide">
		<h3>How to install</h3>
		<div class="steps">
			<div class="step">
				<span class="step-num">1</span>
				<div>
					<h4>Open the DMG</h4>
					<p>Double-click the downloaded <strong>Jelly-Claw.dmg</strong> file. Drag <strong>Jelly-Claw</strong> to the <strong>Applications</strong> folder.</p>
				</div>
			</div>
			<div class="step">
				<span class="step-num">2</span>
				<div>
					<h4>Allow the app to run</h4>
					<p>macOS will block the app since it's not from the App Store. You'll see <em>"Jelly-Claw can't be opened."</em></p>
					<p>Go to <strong>System Settings → Privacy & Security</strong>, scroll down, and click <strong>"Open Anyway"</strong> next to the Jelly-Claw message.</p>
					<div class="screenshot-box">
						<div class="screenshot-placeholder">
							<span class="screenshot-icon">&#xF8FF;</span>
							<span>System Settings → Privacy & Security → Open Anyway</span>
						</div>
					</div>
				</div>
			</div>
			<div class="step">
				<span class="step-num">3</span>
				<div>
					<h4>Grant permissions</h4>
					<p>On first launch, macOS will ask for <strong>camera</strong> and <strong>microphone</strong> access. Click <strong>Allow</strong> for both &mdash; these are needed for video calls and audio recording.</p>
				</div>
			</div>
			<div class="step">
				<span class="step-num">4</span>
				<div>
					<h4>Find it in your menu bar</h4>
					<p>Jelly-Claw lives in your <strong>menu bar</strong> (top-right of your screen). Look for the jellyfish icon. Click it to open the panel.</p>
				</div>
			</div>
		</div>
	</div>

	<div class="install-note">
		<h4>Updating from a previous version?</h4>
		<p>Quit the existing Jelly-Claw from your menu bar (right-click the jellyfish icon → Quit), then drag the new version to Applications. It will replace the old one. Your account stays signed in.</p>
	</div>

	<div class="changelog">
		<h4>What's new in v1.3.0</h4>
		<ul>
			<li>Fixed call recording: audio now properly captured and muxed into video for Jelly posts</li>
			<li>TURN relay servers for reliable 1:1 connections behind firewalls and mobile networks</li>
			<li>Group call recording: fixed record button, added timer display with stop control</li>
			<li>Clean recording folders: each call saves video.mp4, audio.wav, and thumbnail.jpg</li>
			<li>"Open in app" banner on call pages for users with Jelly-Claw installed</li>
		</ul>
		<a href="/download/changelog" class="changelog-link">Full changelog →</a>
	</div>

	<div class="footer">
		<a href="/">jelly-claw.com</a>
		<span class="dot">·</span>
		<a href="/download/archives">Older versions</a>
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

	.install-guide {
		margin-top: 3rem;
		max-width: 500px;
		width: 100%;
	}

	.install-guide h3 {
		font-family: 'Forum', serif;
		font-size: 1.3rem;
		font-weight: 400;
		margin: 0 0 1.2rem;
		color: #f4f1ea;
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.step {
		display: flex;
		gap: 1rem;
		padding: 1rem 1.2rem;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.08);
		border-radius: 12px;
	}

	.step-num {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(56, 152, 236, 0.15);
		border: 1px solid rgba(56, 152, 236, 0.3);
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 700;
		color: #3898ec;
	}

	.step h4 {
		font-size: 0.85rem;
		font-weight: 600;
		margin: 0 0 0.3rem;
		color: rgba(244, 241, 234, 0.85);
	}

	.step p {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.5);
		margin: 0 0 0.4rem;
		line-height: 1.5;
	}

	.step strong { color: rgba(244, 241, 234, 0.8); }
	.step em { color: rgba(234, 130, 56, 0.8); font-style: italic; }

	.screenshot-box {
		margin-top: 0.6rem;
	}

	.screenshot-placeholder {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		background: rgba(244, 241, 234, 0.04);
		border: 1px dashed rgba(244, 241, 234, 0.12);
		border-radius: 8px;
		font-size: 0.7rem;
		color: rgba(244, 241, 234, 0.4);
	}

	.screenshot-icon {
		font-size: 1.1rem;
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

	.changelog-link {
		display: inline-block;
		margin-top: 0.8rem;
		font-size: 0.75rem;
		color: rgba(56, 152, 236, 0.9);
		text-decoration: none;
		letter-spacing: 0.03em;
	}
	.changelog-link:hover { color: #3898ec; }

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
	.dot { color: rgba(244, 241, 234, 0.2); }
</style>

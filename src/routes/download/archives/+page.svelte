<svelte:head>
	<title>Archives · Jelly-Claw</title>
	<meta name="description" content="Archived builds of Jelly-Claw for older Macs. macOS 12 Monterey compatible." />
</svelte:head>

<div class="page">
	<div class="hero">
		<a href="/download" class="back">← back to downloads</a>
		<h1>Archives</h1>
		<p class="tagline">legacy builds for older macs</p>
	</div>

	<div class="release">
		<div class="release-header">
			<h2>Jelly-Claw v1.1 — Original</h2>
			<span class="badge">macOS 12+</span>
		</div>

		<a href="/download/archives/Jelly-Claw-v1.1-macOS12.dmg" download class="download-btn">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7 10 12 15 17 10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			Download for macOS 12+
		</a>
		<p class="meta">3.7 MB · Universal (Intel + Apple Silicon) · Built with Xcode 14.2, Swift 5</p>

		<div class="compat">
			<h3>COMPATIBLE WITH</h3>
			<ul>
				<li>macOS 12 Monterey (2021)</li>
				<li>macOS 13 Ventura (2022)</li>
				<li>macOS 14 Sonoma (2023)</li>
				<li>macOS 15 Sequoia (2024)</li>
				<li>Intel Macs (2013 — 2020)</li>
				<li>Apple Silicon Macs (M1 — M4)</li>
			</ul>
			<p class="compat-note">Designed and tested on a 2013 Mac Pro running macOS 12.7.6 Monterey. If your Mac can run Monterey, this build runs on it.</p>
		</div>

		<div class="changelog">
			<h3>CHANGELOG</h3>
			<div class="entries">
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Multi-party Group Call (up to 8 participants) via Cloudflare Realtime SFU with live video spectators</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Voice Room (up to 8 on mic) with live audio listeners and audio-reactive orb visualizations</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Spectator stadium page with live video/audio, chat sidebar, and token tipping</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>1:1 Call preserved as free-tier default — direct peer-to-peer WebRTC, no SFU cost</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Editorial onboarding flow — connect Jelly account, profile confirmation, friends gate (5+), pricing tier, mic + camera permissions</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Settings pane — account, subscription tier, audio input, free-only toggle, privacy picker</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Multi-select invite picker with Jelly user search — select contacts + search results, create a Jelly group chat via room.start, send the call link to the group</span>
				</div>
				<div class="entry">
					<span class="tag feature">feature</span>
					<span>Screen recording for Group Call/Voice Room via CallRecorder — captures the floating window at 24fps, muxes with JS WAV audio into MP4, posts as Jelly</span>
				</div>
				<div class="entry">
					<span class="tag design">design</span>
					<span>Editorial theme — #070707 background, model photo backdrop with blue + orange radial tints, Forum serif headings, grid overlay</span>
				</div>
				<div class="entry">
					<span class="tag design">design</span>
					<span>Screenshot branding banner: {"{username}"}.jelly-claw.com // AGENTIC SOCIAL MEDIA — centered below the call counter</span>
				</div>
				<div class="entry">
					<span class="tag design">design</span>
					<span>FaceTime-flat video tiles (6px radius, drop shadows, no borders), backdrop-blur header/footer/chat</span>
				</div>
				<div class="entry">
					<span class="tag design">design</span>
					<span>Copy JOIN + WATCH link buttons in the floating call window footer</span>
				</div>
				<div class="entry">
					<span class="tag design">design</span>
					<span>Subdomain URLs: links become {"{username}"}.jelly-claw.com/room/:id</span>
				</div>
				<div class="entry">
					<span class="tag infra">infra</span>
					<span>Cloudflare signaling server — CallRoom DO (1:1 mesh) + SfuRoom DO (multi-party SFU) on signal.jelly-claw.com</span>
				</div>
				<div class="entry">
					<span class="tag infra">infra</span>
					<span>Cloudflare Realtime SFU integration with two-phase publish (session → ICE connect → register tracks)</span>
				</div>
				<div class="entry">
					<span class="tag infra">infra</span>
					<span>Zombie pruning on roster — stale participants cleaned on every hello</span>
				</div>
				<div class="entry">
					<span class="tag fix">fix</span>
					<span>ICE gathering wait before sending offers to Cloudflare (ice-lite, no trickle)</span>
				</div>
				<div class="entry">
					<span class="tag fix">fix</span>
					<span>Remote track attribution via mid→peerId map pre-populated before setRemoteDescription</span>
				</div>
				<div class="entry">
					<span class="tag fix">fix</span>
					<span>TDZ fix for _makeOffer ICE wait (Safari "Cannot access uninitialized variable")</span>
				</div>
				<div class="entry">
					<span class="tag fix">fix</span>
					<span>Server errors now surface immediately instead of a 15-second timeout</span>
				</div>
			</div>
		</div>

		<div class="source">
			<h3>SOURCE</h3>
			<p><a href="https://github.com/Smalltalk-Fam/JellyClaw-2013Computers" target="_blank" rel="noopener">Smalltalk-Fam/JellyClaw-2013Computers</a> — frozen snapshot, macOS 12 deployment target, Xcode 14 compatible</p>
		</div>
	</div>

	<div class="footer">
		<a href="/">jelly-claw.com</a>
		<span class="dot">·</span>
		<a href="/download">Download latest</a>
		<span class="dot">·</span>
		<a href="/pricing">Pricing</a>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #070707;
		color: #f4f1ea;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem 1.5rem;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
	}

	.hero {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.back {
		display: inline-block;
		margin-bottom: 1.2rem;
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.4);
		text-decoration: none;
		letter-spacing: 0.05em;
	}
	.back:hover { color: rgba(244, 241, 234, 0.7); }

	h1 {
		font-family: 'Forum', serif;
		font-size: 2.8rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		margin: 0 0 0.5rem;
	}

	.tagline {
		font-size: 0.9rem;
		color: rgba(244, 241, 234, 0.45);
		letter-spacing: 0.05em;
	}

	.release {
		max-width: 640px;
		width: 100%;
	}

	.release-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	h2 {
		font-family: 'Forum', serif;
		font-size: 1.6rem;
		font-weight: 400;
		margin: 0;
	}

	.badge {
		background: rgba(56, 152, 236, 0.12);
		border: 1px solid rgba(56, 152, 236, 0.35);
		color: rgba(56, 152, 236, 0.95);
		padding: 4px 12px;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 14px 28px;
		background: linear-gradient(135deg, #1a6cd4, #3898ec);
		color: #fff;
		text-decoration: none;
		font-size: 0.95rem;
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

	.meta {
		margin-top: 0.8rem;
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.3);
		letter-spacing: 0.06em;
	}

	.compat, .changelog, .source {
		margin-top: 2.5rem;
	}

	h3 {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: rgba(244, 241, 234, 0.45);
		margin: 0 0 1rem;
	}

	.compat ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.compat li {
		font-size: 0.82rem;
		color: rgba(244, 241, 234, 0.75);
		padding: 0.5rem 0.8rem;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.06);
		border-radius: 8px;
	}

	.compat-note {
		margin-top: 1rem;
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.35);
		line-height: 1.5;
		font-style: italic;
	}

	.entries {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.entry {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		padding: 0.65rem 0.8rem;
		background: rgba(244, 241, 234, 0.02);
		border: 1px solid rgba(244, 241, 234, 0.05);
		border-radius: 8px;
		font-size: 0.8rem;
		color: rgba(244, 241, 234, 0.75);
		line-height: 1.4;
	}

	.tag {
		flex-shrink: 0;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.tag.feature { background: rgba(56, 152, 236, 0.15); color: rgba(56, 152, 236, 0.95); }
	.tag.design { background: rgba(234, 130, 56, 0.15); color: rgba(234, 130, 56, 0.95); }
	.tag.infra { background: rgba(150, 120, 200, 0.15); color: rgba(180, 160, 220, 0.95); }
	.tag.fix { background: rgba(80, 200, 120, 0.15); color: rgba(80, 200, 120, 0.95); }

	.source p {
		font-size: 0.82rem;
		color: rgba(244, 241, 234, 0.6);
		margin: 0;
		line-height: 1.5;
	}
	.source a {
		color: rgba(56, 152, 236, 0.9);
		text-decoration: none;
	}
	.source a:hover { text-decoration: underline; }

	.footer {
		margin-top: 4rem;
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}
	.footer a {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.25);
		text-decoration: none;
		letter-spacing: 0.06em;
	}
	.footer a:hover { color: rgba(244, 241, 234, 0.5); }
	.dot { color: rgba(244, 241, 234, 0.2); }

	@media (max-width: 600px) {
		.compat ul { grid-template-columns: 1fr; }
		h1 { font-size: 2.2rem; }
	}
</style>

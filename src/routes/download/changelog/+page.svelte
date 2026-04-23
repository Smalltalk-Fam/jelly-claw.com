<svelte:head>
	<title>Changelog - Jelly-Claw</title>
	<meta name="description" content="Jelly-Claw release history and changelog." />
</svelte:head>

<div class="page">
	<a href="/download" class="back">&larr; Download</a>

	<h1>Changelog</h1>
	<p class="subtitle">Release history for Jelly-Claw for macOS.</p>

	<section class="release current">
		<div class="release-header">
			<h2>v1.9.0</h2>
			<span class="date">April 23, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.9.0.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Chromium browser:</strong> Genie uses standalone Chromium — no Chrome profile conflicts.</li>
			<li><strong>Create Reel:</strong> Select jellies, pick duration, Genie edits with FFmpeg.</li>
			<li><strong>Your Jellies:</strong> Thumbnail grid with infinite scroll in Library.</li>
			<li><strong>Chat redesign:</strong> Dark cards, timestamps, clickable links, copy buttons.</li>
			<li><strong>Telegram:</strong> 3-step setup with QR codes, bot name display, disconnect.</li>
			<li><strong>Stop/cancel:</strong> Works on follow-ups, bypasses queue, local /chat endpoint.</li>
			<li><strong>Full results:</strong> No truncation on wish results.</li>
			<li><strong>Claude fix:</strong> Removed --bare flag, auto-install CLI, auto-fix path.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.8.4</h2>
			<span class="date">April 23, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.8.4.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Server sync fix:</strong> All genie-server changes now verified in-sync before deploy. Fixes "something went wrong" on other machines caused by stale server code.</li>
			<li><strong>Live chat:</strong> Wish detail view shows real-time chat with Genie. Type replies, send stop/cancel directly.</li>
			<li><strong>Stop/cancel:</strong> Bypasses message queue, works on follow-up dispatches, routes through local /chat endpoint.</li>
			<li><strong>Claude CLI:</strong> Auto-installs our own version on every launch. Fixes old Homebrew Claude "--bare unknown option" errors.</li>
			<li><strong>Receipt fix:</strong> "Wish granted" receipts now deliver correctly (creator variable was missing).</li>
			<li><strong>Chat improvements:</strong> Sender names shown, system messages filtered, follow-ups hidden from wish list.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.8.3</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.8.3.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Quick Jelly redesign:</strong> "Send Jelly" button, posts as unlisted by default, skips photo review. Shows hints about Genie activation.</li>
			<li><strong>Chat sender names:</strong> Each message shows "Genie" or the user's name. Uses user_id detection instead of content prefixes.</li>
			<li><strong>System messages filtered:</strong> "joined the group" and similar messages hidden from chat.</li>
			<li><strong>Follow-ups hidden:</strong> "Re:" dispatches no longer show as separate wish cards.</li>
			<li><strong>Auto-fix Claude CLI:</strong> On every launch, checks if GENIE_CLAUDE_BIN points to our local install. Auto-installs if missing, fixes path if wrong.</li>
			<li><strong>Stop/cancel fix:</strong> Now works on follow-up dispatches. Bypasses message queue. Direct routing via local /chat endpoint.</li>
			<li><strong>Stale VIEW JELLY fix:</strong> jellyURL reset before each upload.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.8.2</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.8.2.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Live chat in wishes:</strong> Open a wish to see real-time chat with Genie. Type replies, send stop/cancel, follow up — all synced with JellyChat.</li>
			<li><strong>Stop/cancel fix:</strong> "stop" now bypasses the message queue and kills the process immediately. Works on follow-up dispatches too.</li>
			<li><strong>Claude CLI auto-install:</strong> App installs its own Claude CLI instead of relying on the user's Homebrew version. Fixes "--bare unknown option" on older installs.</li>
			<li><strong>API key fix:</strong> Provisioning now writes to .env even when config.genieRepoDir is unset.</li>
			<li><strong>Local /chat endpoint:</strong> Mac app sends messages through the local genie-server for instant processing instead of WebSocket detection.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.8.1</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.8.1.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Auto-transcription:</strong> Quick Jelly recordings are automatically transcribed using Apple Speech Recognition. Saves transcript.txt and subtitles.srt alongside each audio file.</li>
			<li><strong>Library transcripts:</strong> Recordings with transcripts show an expand button — tap to read the full transcript inline, like a voice note.</li>
			<li><strong>Organized recordings:</strong> Each Quick Jelly saves to its own folder (genie-{timestamp}/) with the audio file named to match.</li>
			<li><strong>Personalized wish URLs:</strong> Wish links use {username}.jelly-claw.com/genie/{id} subdomain format.</li>
			<li><strong>Wish pages:</strong> Public wish detail pages with linkified results and "Watch on JellyJelly" button.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.8.0</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.8.0.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Settings redesign:</strong> Cleaner cards, consistent widths, full-width buttons. Audio input and About sections in proper cards. Quit button styled.</li>
			<li><strong>Genie tab redesign:</strong> Wishes in all-caps header, cards with genie icon and sparkle for completed, compact server status bar with start/stop/restart.</li>
			<li><strong>Notifications card:</strong> Jelly Chat and Telegram combined in one card. Disconnect Telegram button. Inline Telegram setup with QR codes for BotFather and userinfobot.</li>
			<li><strong>Tools card:</strong> View Logs, Clear Logs, Full Debug as icon buttons. Uninstall as full-width button.</li>
			<li><strong>Quick Jelly:</strong> Renamed from Quick Genie. Jellyfish emoji on Home tab. Popover auto-closes when shortcut triggers.</li>
			<li><strong>Home tab:</strong> Renamed from People. House icon. Shortcut activation banner at bottom.</li>
			<li><strong>PiP fix:</strong> Call window dragging no longer blocks WebView interactions (PiP, video controls).</li>
			<li><strong>Dispatch tracking:</strong> Creator username now synced to Supabase on every wish. Status updates in real-time.</li>
			<li><strong>Telegram fix:</strong> Chat ID sent as number, whitespace trimmed, error messages logged to activity feed.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.7</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.7.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Server controls:</strong> Start, stop, and restart buttons with loading indicators. Restart syncs server files and restarts from scratch.</li>
			<li><strong>Update banner redesign:</strong> Full-width banner below masthead with release notes and prominent install button. Visible on all tabs.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.6</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.6.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Claude -p spawn fix:</strong> Fixed diagnostic test failing with cwd error by setting explicit working directory.</li>
			<li><strong>Force restart on sync:</strong> Server always stops and restarts after file sync, fixing stale processes after update.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.5</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.5.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Claude CLI reinstall:</strong> "Install Claude CLI" button appears in diagnostics when Claude is missing.</li>
			<li><strong>Diagnostics use GENIE_CLAUDE_BIN:</strong> Health checks now use the same binary path as the dispatcher.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.4</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.4.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Server sync fix:</strong> Bumped genie-server to v1.3.0 to force sync on machines that had v1.2.0 from previous update.</li>
			<li><strong>Update banner:</strong> Moved to the masthead so it's visible on all tabs, not just People.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.3</h2>
			<span class="date">April 22, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.3.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Debug page:</strong> Full diagnostic page at localhost:7778/debug — system info, auth status, Claude spawn test, Chrome CDP, recent logs. Accessible via "FULL DEBUG" link in Genie settings.</li>
			<li><strong>Activity log card:</strong> Genie settings now shows a styled activity log with line numbers, copy button, and debug link.</li>
			<li><strong>Launch logging:</strong> App version, server sync status, auth sync, and API key provisioning all logged to the activity feed.</li>
			<li><strong>Sync guard logging:</strong> Activity log now explains why server sync was skipped (setup incomplete, bundled server not found).</li>
			<li><strong>API key hidden:</strong> Debug page shows "set" instead of key prefix.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.2</h2>
			<span class="date">April 21, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.2.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Activity log:</strong> Genie tab now shows live status messages — server sync, auth, API key provisioning — so you can see what's happening on launch.</li>
			<li><strong>Server auto-sync fix:</strong> Server restart after API key provisioning ensures new installs work immediately without manual restart.</li>
			<li><strong>Diagnostics fallback:</strong> "Run Diagnostics" now falls back gracefully on older server versions instead of showing "Not responding".</li>
			<li><strong>Genie server v1.2.0:</strong> Bumped to trigger auto-sync on existing installs, delivering the /health endpoint and API key fixes.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.1</h2>
			<span class="date">April 21, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.1.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Genie diagnostics:</strong> "Run Diagnostics" button in Genie settings checks Node, Claude CLI, claude -p spawn, Chrome CDP, auth token, and polling status with green/orange indicators.</li>
			<li><strong>API key fix:</strong> Fixed a bug where the Anthropic API key was not returned on JWT fallback, causing Genie to silently fail on new installs after token expiry.</li>
			<li><strong>Grant wishes:</strong> Admin UI to search users and grant Genie wishes. Recipients get a DM notification from Genie.</li>
			<li><strong>Universal Binary:</strong> App now ships as arm64 + x86_64, supporting both Apple Silicon and Intel Macs.</li>
			<li><strong>Quick Jelly recording:</strong> 10-minute max with 30-second countdown warning. Background recorder suspends during Quick Jelly.</li>
			<li><strong>Connected services:</strong> Genie settings now show CLI tools (GitHub, Vercel, Wrangler, Stripe, Claude) with auth status and usernames alongside browser sessions. Loading indicator while fetching.</li>
			<li><strong>Racct.com:</strong> Added as a connected service.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.7.0</h2>
			<span class="date">April 21, 2026</span>
			<a href="https://pub-c94364582fb0435696f1f9966ea32615.r2.dev/Jelly-Claw-1.7.0.dmg" download class="dl-pill">Download</a>
		</div>
		<ul>
			<li><strong>Borderless call windows:</strong> 1:1 calls, group calls, and voice rooms now use clean borderless panels with no title bar. Camera and video fill the entire window.</li>
			<li><strong>Draggable from anywhere:</strong> Click and drag anywhere on the call window to move it. Buttons still work normally.</li>
			<li><strong>Windows no longer always-on-top:</strong> Call panels now behave like normal windows &mdash; you can put other windows in front of them.</li>
			<li><strong>Direct podcast recording:</strong> Record button on 1:1 calls goes straight to full A/V podcast mode. No more intermediate picker.</li>
			<li><strong>Hang-up closes window:</strong> Tapping end call now closes the call panel automatically on both 1:1 and group calls.</li>
			<li><strong>FaceTime-style hang-up:</strong> Group call and voice room hang-up button moved to bottom-right with a FaceTime-style icon.</li>
			<li><strong>Copy link redesign:</strong> Apple-style copy icon with green checkmark flash feedback when link is copied.</li>
			<li><strong>Accessibility fix:</strong> Shortcuts now activate automatically after granting Accessibility permission &mdash; no more reinstall needed.</li>
			<li><strong>Quick Genie audio save:</strong> Audio recordings from Quick Genie are saved to <code>~/Downloads/jelly-claw/genie/</code> with timestamps.</li>
			<li><strong>Sidebar refresh:</strong> Cleaner sidebar with icons spaced evenly from top, jellyfish logo removed.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.6.0</h2>
			<span class="date">April 16, 2026</span>
		</div>
		<ul>
			<li><strong>New sidebar layout:</strong> Redesigned sidebar with tab-based navigation for People, Genie, and Library.</li>
			<li><strong>Library:</strong> Browse and play back local recordings from the app.</li>
			<li><strong>Genie messaging overhaul:</strong> Improved Genie dispatch and chat integration.</li>
			<li><strong>Glass design:</strong> Updated visual design with glass-morphism elements.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.4.0</h2>
			<span class="date">April 15, 2026</span>
		</div>
		<ul>
			<li><strong>Recording audio fix:</strong> Call recordings now properly capture audio from both participants. Replaced Safari-incompatible MediaRecorder with ScriptProcessor PCM capture for reliable mixed audio. Posted Jellies now have sound and can be transcribed.</li>
			<li><strong>TURN relay servers:</strong> 1:1 calls now use Cloudflare TURN (UDP + TCP) as relay fallback. Fixes "Waiting for host" on mobile networks, corporate firewalls, and symmetric NAT.</li>
			<li><strong>Group call recording:</strong> Fixed record button that was stuck (checked wrong state variable). Added recording timer with pulsing red dot and MM:SS counter. Stop button now works and shows "Post as Jelly" overlay.</li>
			<li><strong>Clean recording folders:</strong> Each recording saves to a single folder with <code>video.mp4</code> (with audio), <code>audio.wav</code> (raw), and <code>thumbnail.jpg</code>. No more duplicate flat copies.</li>
			<li><strong>"Open in app" banner:</strong> 1:1 call pages show a banner for Mac users with a <code>jellyclaw://</code> deep link to open the call in the native app.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.2.0</h2>
			<span class="date">April 13, 2026</span>
		</div>
		<ul>
			<li><strong>Phone sign-up:</strong> Country code picker with flags when entering a phone number. Defaults to US (+1), supports 20 countries.</li>
			<li><strong>Auto-focus + auto-verify:</strong> Sign-in fields auto-focus on load. OTP verification triggers automatically when 6 digits are entered.</li>
			<li><strong>DM and group chat fixes:</strong> Fixed intermittent failures in sending call invites via Jelly Chat. Added proper WebSocket ping/pong handling.</li>
			<li><strong>Contacts sidebar:</strong> During calls, tap the person icon to open a contacts panel. Invite people to the call with one tap &mdash; they get the link via DM.</li>
			<li><strong>Guest rejoin:</strong> When someone leaves a 1:1 call and clicks the link again, they can rejoin. Links stay active for 30 minutes.</li>
			<li><strong>Deep links:</strong> <code>jellyclaw://</code> URL scheme registered. Call links can open directly in the app when installed.</li>
			<li><strong>Profile on launch:</strong> Settings now shows your profile immediately after opening the app (previously showed "Not signed in" until you re-logged).</li>
			<li><strong>Recording folders:</strong> Each recording now saves to its own folder.</li>
			<li><strong>Browser rejoin:</strong> 1:1 call pages in the browser show a "Rejoin Call" button after the call ends.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.1.0</h2>
			<span class="date">April 9, 2026</span>
		</div>
		<ul>
			<li><strong>Group calls:</strong> Multi-party video calls via Cloudflare Realtime SFU. Up to 8 participants with unlimited spectators.</li>
			<li><strong>Voice rooms:</strong> Audio-only group rooms with live listeners.</li>
			<li><strong>Watch links:</strong> Share <code>/room/&#123;id&#125;/watch</code> links for anyone to spectate a group call from their browser.</li>
			<li><strong>SFU infrastructure:</strong> Two-phase publish (session first, tracks after ICE connects) for reliable WebRTC connections.</li>
			<li><strong>Chat in calls:</strong> Live chat with tipping during group calls and voice rooms.</li>
			<li><strong>Editorial UI:</strong> Backdrop, screenshot banner, and branded subdomain display on all call pages.</li>
			<li><strong>Multi-select invites:</strong> Select multiple contacts when starting a group call or voice room.</li>
			<li><strong>ICE gathering:</strong> Wait for ICE candidates to complete before sending offers, fixing connection failures on slower networks.</li>
		</ul>
	</section>

	<section class="release">
		<div class="release-header">
			<h2>v1.0.0</h2>
			<span class="date">March 2026</span>
		</div>
		<ul>
			<li><strong>1:1 video calls:</strong> FaceTime-style calls with a shareable link. Guest joins from any browser.</li>
			<li><strong>Recording:</strong> Four modes &mdash; Guest Video, Audio over Thumbnail, Full A/V (video podcast), and Audio Only.</li>
			<li><strong>Post as Jelly:</strong> Upload call recordings directly to your Jelly feed as public or unlisted posts.</li>
			<li><strong>Audio capture:</strong> Always-on 5-minute audio buffer. Clip and save the last thing you heard.</li>
			<li><strong>Menu bar app:</strong> Lives in your macOS menu bar. One click to start a call or clip audio.</li>
			<li><strong>Jelly integration:</strong> Browse contacts, send DMs, and post clips &mdash; all from the menu bar.</li>
			<li><strong>Supabase auth:</strong> Sign in with email or phone OTP, or email + password.</li>
		</ul>
	</section>

	<div class="footer">
		<a href="/download">&larr; Back to download</a>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #070707;
		color: #f4f1ea;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
	}

	.page {
		min-height: 100vh;
		max-width: 640px;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	.back {
		font-size: 0.8rem;
		color: rgba(56, 152, 236, 0.9);
		text-decoration: none;
		letter-spacing: 0.03em;
	}
	.back:hover { color: #3898ec; }

	h1 {
		font-family: 'Forum', serif;
		font-size: 2.4rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		margin: 1.5rem 0 0.3rem;
	}

	.subtitle {
		font-size: 0.85rem;
		color: rgba(244, 241, 234, 0.45);
		margin: 0 0 2.5rem;
	}

	.release {
		margin-bottom: 2.5rem;
		padding: 1.5rem;
		background: rgba(244, 241, 234, 0.02);
		border: 1px solid rgba(244, 241, 234, 0.06);
		border-radius: 14px;
	}

	.release.current {
		border-color: rgba(56, 152, 236, 0.25);
		background: rgba(56, 152, 236, 0.04);
	}

	.release-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.release-header h2 {
		font-family: 'Forum', serif;
		font-size: 1.3rem;
		font-weight: 400;
		margin: 0;
	}

	.date {
		font-size: 0.72rem;
		color: rgba(244, 241, 234, 0.35);
		letter-spacing: 0.08em;
	}

	.dl-pill {
		margin-left: auto;
		padding: 5px 14px;
		background: linear-gradient(135deg, #1a6cd4, #3898ec);
		color: #fff;
		text-decoration: none;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		border-radius: 999px;
		transition: transform 0.15s;
	}
	.dl-pill:hover { transform: translateY(-1px); }

	ul {
		margin: 0;
		padding-left: 0;
		list-style: none;
	}

	li {
		font-size: 0.8rem;
		color: rgba(244, 241, 234, 0.6);
		line-height: 1.6;
		padding: 0.3rem 0;
		padding-left: 1rem;
		position: relative;
	}

	li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.65rem;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(56, 152, 236, 0.5);
	}

	li strong {
		color: rgba(244, 241, 234, 0.85);
		font-weight: 600;
	}

	li code {
		font-size: 0.72rem;
		background: rgba(244, 241, 234, 0.06);
		padding: 1px 5px;
		border-radius: 4px;
		font-family: ui-monospace, monospace;
		color: rgba(244, 241, 234, 0.7);
	}

	.footer {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(244, 241, 234, 0.06);
	}

	.footer a {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.3);
		text-decoration: none;
	}
	.footer a:hover { color: rgba(244, 241, 234, 0.6); }
</style>

<svelte:head>
	<title>Privacy Policy - Jelly-Claw</title>
	<meta name="description" content="Jelly-Claw privacy policy." />
</svelte:head>

<div class="page">
	<a href="/download" class="back">&larr; Download</a>

	<h1>Privacy Policy</h1>
	<p class="updated">Last updated: April 20, 2026</p>

	<section>
		<h2>We Don't Collect Your Data</h2>
		<p>Jelly-Claw does not collect, store, sell, or share your personal information. We don't track you, we don't profile you, and we don't monetize your data.</p>
	</section>

	<section>
		<h2>Local by Default</h2>
		<p>Your recordings, audio clips, and app preferences are stored locally on your device. We don't have access to them and we don't upload them to our servers unless you explicitly choose to share or post content.</p>
	</section>

	<section>
		<h2>Account Information</h2>
		<p>If you sign in with a phone number or email, that information is used solely for authentication. We don't use it for marketing, we don't sell it, and we don't share it with third parties.</p>
	</section>

	<section>
		<h2>Calls and Communication</h2>
		<p>Video and voice calls are peer-to-peer when possible, relayed through Cloudflare TURN servers when necessary. We don't record, monitor, or store your calls. If you choose to record a call, the recording is saved to your device.</p>
	</section>

	<section>
		<h2>No Analytics or Tracking</h2>
		<p>Jelly-Claw does not include analytics SDKs, tracking pixels, or third-party advertising. We don't know how you use the app and we prefer it that way.</p>
	</section>

	<section>
		<h2>Changes to This Policy</h2>
		<p>If we ever change this policy, we'll update it here. But our stance is simple: your data is yours.</p>
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

	.updated {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.35);
		margin: 0 0 2.5rem;
	}

	section {
		margin-bottom: 2rem;
	}

	h2 {
		font-family: 'Forum', serif;
		font-size: 1.2rem;
		font-weight: 400;
		margin: 0 0 0.5rem;
		color: rgba(244, 241, 234, 0.9);
	}

	p {
		font-size: 0.85rem;
		color: rgba(244, 241, 234, 0.55);
		line-height: 1.7;
		margin: 0;
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

<svelte:head>
	<title>Terms of Service - Jelly-Claw</title>
	<meta name="description" content="Jelly-Claw terms of service." />
</svelte:head>

<div class="page">
	<a href="/download" class="back">&larr; Download</a>

	<h1>Terms of Service</h1>
	<p class="updated">Last updated: April 20, 2026</p>

	<section>
		<h2>Alpha Software</h2>
		<p>Jelly-Claw is experimental software currently in alpha. It is provided on an "as is" and "as available" basis. Features may change, break, or be removed at any time without notice.</p>
	</section>

	<section>
		<h2>No Warranty</h2>
		<p>Jelly-Claw is provided without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We make no guarantees that the software will be error-free, secure, or available at any particular time.</p>
	</section>

	<section>
		<h2>Limitation of Liability</h2>
		<p>To the fullest extent permitted by law, Jelly-Claw and its creators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, revenue, or profits, arising out of or related to your use of the software.</p>
	</section>

	<section>
		<h2>Use at Your Own Risk</h2>
		<p>By downloading, installing, or using Jelly-Claw, you acknowledge that you do so entirely at your own risk. You are solely responsible for any damage to your device, loss of data, or other harm that results from using the software.</p>
	</section>

	<section>
		<h2>No Guarantees of Availability</h2>
		<p>We may modify, suspend, or discontinue Jelly-Claw at any time without notice or liability. We are under no obligation to provide support, updates, or bug fixes.</p>
	</section>

	<section>
		<h2>Changes to These Terms</h2>
		<p>We reserve the right to update these terms at any time. Continued use of Jelly-Claw after changes constitutes acceptance of the updated terms.</p>
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

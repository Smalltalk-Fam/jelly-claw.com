<svelte:head>
	<title>Pricing · Jelly-Claw</title>
	<meta name="description" content="Jelly-Claw pricing — Free, Creator $30/mo, Pro $99/mo, Enterprise. Wobbles owners get Pro free for life. Earn tokens by staking jellies, renting CPU, and posting." />
</svelte:head>

<div class="page">
	<div class="hero">
		<h1>Pricing</h1>
		<p class="tagline">choose your plan for agentic social media</p>
	</div>

	<div class="wobbles-banner">
		<span class="wobble-emoji">🪼</span>
		<div class="wobble-text">
			<strong>Wobbles owners get Pro free for life.</strong>
			<span>Sign in with your wobble to unlock automatically.</span>
		</div>
	</div>

	<div class="tiers">
		<!-- Free -->
		<div class="tier free">
			<div class="tag">FREE</div>
			<div class="price">
				<span class="price-main">$0</span>
				<span class="price-sub">forever</span>
			</div>
			<ul class="features">
				<li>Always-on 5-minute audio buffer</li>
				<li>Post Jellies (public & unlisted)</li>
				<li>1:1 video calls with recording</li>
				<li>Earn tokens on every post</li>
				<li>Menu bar app for macOS</li>
			</ul>
			<a href="/download" class="cta cta-outline">
				Download for free
			</a>
		</div>

		<!-- Creator -->
		<div class="tier creator">
			<div class="tag">CREATOR</div>
			<div class="price">
				<span class="price-main">$30</span>
				<span class="price-sub">/ month</span>
			</div>
			<ul class="features">
				<li>Everything in Free</li>
				<li>Access to Genie</li>
				<li>Shop creation</li>
				<li>Rapid publishing</li>
				<li>Always-on recording</li>
				<li>Idea generation</li>
			</ul>
			<a href="mailto:hello@jelly-claw.com?subject=Creator%20Plan" class="cta cta-outline">
				Start creating
			</a>
		</div>

		<!-- Pro (highlighted) -->
		<div class="tier pro highlighted">
			<div class="badge">MOST POPULAR</div>
			<div class="tag">PRO</div>
			<div class="price">
				<span class="price-main">$99</span>
				<span class="price-sub">/ month</span>
			</div>
			<ul class="features">
				<li>Everything in Creator</li>
				<li>Priority Genie compute</li>
				<li>Bulk publishing & scheduling</li>
				<li>Private jellies (pay-to-watch)</li>
				<li>Advanced analytics</li>
				<li>API access</li>
				<li>2× token earning rate</li>
			</ul>
			<a href="mailto:hello@jelly-claw.com?subject=Pro%20Plan" class="cta cta-primary">
				Go Pro
			</a>
		</div>

		<!-- Enterprise -->
		<div class="tier enterprise">
			<div class="tag">ENTERPRISE</div>
			<div class="price">
				<span class="price-main">Contact</span>
				<span class="price-sub">us</span>
			</div>
			<ul class="features">
				<li>Everything in Pro</li>
				<li>Our Model Agency installs it at your company</li>
				<li>Team seats & admin tools</li>
				<li>Custom integrations</li>
				<li>Dedicated success manager</li>
				<li>SLA & priority support</li>
			</ul>
			<a href="mailto:hello@jelly-claw.com?subject=Enterprise%20Inquiry" class="cta cta-outline">
				Contact Model Agency
			</a>
		</div>
	</div>

	<div class="divider"></div>

	<!-- Ways to earn tokens -->
	<section class="tokens">
		<h2>Ways to earn tokens</h2>
		<p class="tokens-sub">every interaction is an opportunity</p>

		<div class="tokens-grid">
			<div class="token-card">
				<div class="token-icon">🪼</div>
				<h3>Stake your Jelly</h3>
				<p>Lock tokens to back your clips. Earn a share when they go viral.</p>
			</div>
			<div class="token-card">
				<div class="token-icon">💻</div>
				<h3>Rent your CPU</h3>
				<p>Run Genie inference locally while you sleep. Get paid in tokens.</p>
			</div>
			<div class="token-card">
				<div class="token-icon">🎙</div>
				<h3>Post Jellies</h3>
				<p>Every published jelly earns tokens. The more you post, the more you make.</p>
			</div>
		</div>
	</section>

	<div class="footer">
		<a href="/">jelly-claw.com</a>
		<span class="dot">·</span>
		<a href="/download">Download</a>
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
		padding: 4rem 1.5rem;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
	}

	.hero {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-family: 'Forum', serif;
		font-size: 3.2rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		margin: 0 0 0.5rem;
	}

	.tagline {
		font-size: 0.95rem;
		color: rgba(244, 241, 234, 0.5);
		letter-spacing: 0.05em;
	}

	/* Wobbles callout */
	.wobbles-banner {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 600px;
		width: 100%;
		padding: 1rem 1.4rem;
		margin-bottom: 2.5rem;
		background: linear-gradient(135deg, rgba(56, 152, 236, 0.08), rgba(56, 152, 236, 0.02));
		border: 1px solid rgba(56, 152, 236, 0.25);
		border-radius: 14px;
	}

	.wobble-emoji {
		font-size: 1.8rem;
		flex-shrink: 0;
	}

	.wobble-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.wobble-text strong {
		font-size: 0.88rem;
		font-weight: 600;
		color: #f4f1ea;
	}

	.wobble-text span {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.5);
	}

	/* Tier cards */
	.tiers {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.2rem;
		max-width: 1280px;
		width: 100%;
		margin-bottom: 3rem;
	}

	.tier {
		position: relative;
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.08);
		border-radius: 16px;
		padding: 1.8rem 1.4rem 1.6rem;
		display: flex;
		flex-direction: column;
	}

	.tier.highlighted {
		background: linear-gradient(180deg, rgba(56, 152, 236, 0.08) 0%, rgba(244, 241, 234, 0.03) 100%);
		border-color: rgba(56, 152, 236, 0.4);
		box-shadow: 0 8px 40px rgba(56, 152, 236, 0.15);
	}

	.badge {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		background: linear-gradient(135deg, #1a6cd4, #3898ec);
		color: #fff;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		padding: 5px 12px;
		border-radius: 10px;
		white-space: nowrap;
	}

	.tag {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		color: rgba(244, 241, 234, 0.5);
		margin-bottom: 0.9rem;
	}

	.tier.highlighted .tag {
		color: rgba(56, 152, 236, 0.9);
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 1.3rem;
	}

	.price-main {
		font-family: 'Forum', serif;
		font-size: 2.2rem;
		font-weight: 400;
		color: #f4f1ea;
	}

	.price-sub {
		font-size: 0.78rem;
		color: rgba(244, 241, 234, 0.4);
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem;
		flex: 1;
	}

	.features li {
		font-size: 0.78rem;
		color: rgba(244, 241, 234, 0.7);
		padding: 0.4rem 0;
		border-bottom: 1px solid rgba(244, 241, 234, 0.04);
		line-height: 1.4;
	}

	.features li:last-child {
		border-bottom: none;
	}

	.cta {
		display: block;
		text-align: center;
		padding: 11px 18px;
		border-radius: 12px;
		font-size: 0.83rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-decoration: none;
		transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
	}

	.cta-primary {
		background: linear-gradient(135deg, #1a6cd4, #3898ec);
		color: #fff;
		box-shadow: 0 4px 24px rgba(56, 152, 236, 0.3);
	}

	.cta-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(56, 152, 236, 0.5);
	}

	.cta-outline {
		background: rgba(244, 241, 234, 0.03);
		color: #f4f1ea;
		border: 1px solid rgba(244, 241, 234, 0.15);
	}

	.cta-outline:hover {
		background: rgba(244, 241, 234, 0.08);
		transform: translateY(-2px);
	}

	/* Divider */
	.divider {
		width: 80%;
		max-width: 600px;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(244, 241, 234, 0.1), transparent);
		margin: 2rem 0 3rem;
	}

	/* Tokens section */
	.tokens {
		max-width: 1100px;
		width: 100%;
		text-align: center;
	}

	.tokens h2 {
		font-family: 'Forum', serif;
		font-size: 2.2rem;
		font-weight: 400;
		margin: 0 0 0.5rem;
	}

	.tokens-sub {
		font-size: 0.85rem;
		color: rgba(244, 241, 234, 0.4);
		letter-spacing: 0.05em;
		margin-bottom: 2.5rem;
	}

	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.2rem;
	}

	.token-card {
		background: rgba(244, 241, 234, 0.03);
		border: 1px solid rgba(244, 241, 234, 0.06);
		border-radius: 12px;
		padding: 1.6rem 1.2rem;
		text-align: left;
	}

	.token-icon {
		font-size: 1.8rem;
		margin-bottom: 0.8rem;
	}

	.token-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.4rem;
		color: #f4f1ea;
	}

	.token-card p {
		font-size: 0.8rem;
		color: rgba(244, 241, 234, 0.5);
		margin: 0;
		line-height: 1.5;
	}

	/* Footer */
	.footer {
		margin-top: 4rem;
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}

	.footer a {
		font-size: 0.75rem;
		color: rgba(244, 241, 234, 0.3);
		text-decoration: none;
		letter-spacing: 0.06em;
	}

	.footer a:hover { color: rgba(244, 241, 234, 0.6); }

	.dot {
		color: rgba(244, 241, 234, 0.2);
	}

	/* Responsive */
	@media (max-width: 1100px) {
		.tiers {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.tiers, .tokens-grid {
			grid-template-columns: 1fr;
		}
		.tier.highlighted {
			order: -1;
		}
		h1 { font-size: 2.4rem; }
		.tokens h2 { font-size: 1.8rem; }
	}
</style>

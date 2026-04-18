<svelte:head>
	<title>Upgrade Genie · Jelly-Claw</title>
	<meta name="description" content="Upgrade your Genie plan. Say genie in a JellyJelly video — it builds sites, posts tweets, orders food. Choose your plan." />
</svelte:head>

<div class="page">
	<div class="hero">
		<div class="genie-icon">🧞</div>
		<h1>Upgrade Genie</h1>
		<p class="tagline">say "genie" in a jelly. it does the rest.</p>
	</div>

	<div class="wobbles-banner">
		<img src="/wobbles-logo.svg" alt="Wobbles" class="wobble-logo" />
		<div>
			<strong>Wobbles owners get Creator free for life.</strong>
			<span class="wobble-sub">You still pay for usage. <a href="https://jellyjelly.com/wobbles">Get a Wobble</a> · <span class="wobble-count">900 left</span></span>
		</div>
	</div>

	<div class="tiers">
		<div class="tier">
			<div class="tag">FREE</div>
			<div class="price">
				<span class="price-main">$0</span>
				<span class="price-sub">/ month</span>
			</div>
			<ul class="features">
				<li>10 wishes / month</li>
				<li>Jelly Chat updates</li>
				<li>Pay for usage</li>
			</ul>
			<div class="cta cta-disabled">CURRENT PLAN</div>
		</div>

		<div class="tier">
			<div class="tag">BASIC</div>
			<div class="price">
				<span class="price-main">$30</span>
				<span class="price-sub">/ month</span>
			</div>
			<div class="premium-badge">Premium Jelly: shop, paywalls, monetization included</div>
			<ul class="features">
				<li>30 wishes / month</li>
				<li>Jelly Chat + Telegram</li>
				<li>Browser automation</li>
				<li class="premium">Group live calls + streams</li>
				<li>Pay for usage</li>
			</ul>
			<button class="cta cta-outline" onclick={() => subscribe('basic')} disabled={loading === 'basic'}>{loading === 'basic' ? 'LOADING...' : 'SUBSCRIBE'}</button>
		</div>

		<div class="tier popular">
			<div class="tag popular-tag">CREATOR</div>
			<div class="price">
				<span class="price-main">$100</span>
				<span class="price-sub">/ month</span>
			</div>
			<div class="premium-badge">Premium Jelly: shop, paywalls, monetization included</div>
			<ul class="features">
				<li>100 wishes / month</li>
				<li>Jelly Chat + Telegram</li>
				<li>Browser automation</li>
				<li>Priority execution</li>
				<li class="premium">Group live calls + streams</li>
				<li>Pay for usage</li>
			</ul>
			<button class="cta cta-fill" onclick={() => subscribe('creator')} disabled={loading === 'creator'}>{loading === 'creator' ? 'LOADING...' : 'SUBSCRIBE'}</button>
		</div>

		<div class="tier">
			<div class="tag">PRO MAXXER</div>
			<div class="price">
				<span class="price-main">$500</span>
				<span class="price-sub">/ month</span>
			</div>
			<div class="premium-badge">Premium Jelly: shop, paywalls, monetization included</div>
			<ul class="features">
				<li>Unlimited wishes</li>
				<li>Jelly Chat + Telegram</li>
				<li>Browser automation</li>
				<li>Priority execution</li>
				<li class="premium">Group live calls + streams</li>
				<li>Pay for usage</li>
			</ul>
			<button class="cta cta-outline" onclick={() => subscribe('promaxxer')} disabled={loading === 'promaxxer'}>{loading === 'promaxxer' ? 'LOADING...' : 'SUBSCRIBE'}</button>
		</div>
	</div>

	<div class="usage-note">
		All plans pay for API usage at cost + 5%. Your subscription covers the wish limit — usage is billed separately based on what Claude does for each wish.
	</div>

	<div class="enterprise">
		Need a custom plan for your team? <a href="mailto:iqram@imonsmalltalk.com">Contact us for Enterprise</a>
	</div>

	<div class="footer-link">
		<a href="/">jelly-claw.com</a>
	</div>
</div>

<script>
	let loading = $state('');

	async function subscribe(tier) {
		const params = new URLSearchParams(window.location.hash.slice(1));
		const token = params.get('token');

		if (!token) {
			alert('Open this page from the Jelly-Claw app to subscribe.');
			return;
		}

		loading = tier;

		try {
			const res = await fetch('https://signal.jelly-claw.com/genie/subscribe', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ tier }),
			});

			const data = await res.json();

			if (data.checkoutUrl) {
				window.location.href = data.checkoutUrl;
			} else {
				alert(data.error || 'Something went wrong');
				loading = '';
			}
		} catch {
			alert('Connection error. Try again.');
			loading = '';
		}
	}
</script>

<style>
	.page {
		max-width: 900px;
		margin: 0 auto;
		padding: 80px 24px;
	}

	.hero {
		text-align: center;
		margin-bottom: 56px;
	}

	.genie-icon {
		font-size: 56px;
		margin-bottom: 16px;
	}

	.hero h1 {
		font-family: var(--display);
		font-size: 36px;
		font-weight: 400;
		letter-spacing: -0.5px;
		margin-bottom: 8px;
	}

	.tagline {
		font-size: 14px;
		color: var(--muted);
		letter-spacing: 2px;
		text-transform: lowercase;
	}

	.tiers {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	@media (max-width: 768px) {
		.tiers { grid-template-columns: 1fr; max-width: 340px; margin: 0 auto; }
	}

	.tier {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 28px 22px;
		display: flex;
		flex-direction: column;
		transition: border-color 0.2s, transform 0.2s;
	}

	.tier:hover {
		border-color: var(--line-strong);
		transform: translateY(-2px);
	}

	.tier.popular {
		border-color: rgba(74, 133, 255, 0.4);
		box-shadow: 0 0 40px rgba(74, 133, 255, 0.08);
	}

	.tag {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 2.5px;
		color: var(--muted);
		margin-bottom: 16px;
		height: 14px;
	}

	.popular-tag {
		color: #4a85ff;
	}

	.price {
		margin-bottom: 2px;
	}

	.price-main {
		font-family: var(--display);
		font-size: 32px;
	}

	.price-sub {
		font-size: 14px;
		color: var(--muted);
	}

	.overage {
		font-size: 11px;
		color: var(--muted);
		margin-bottom: 20px;
		opacity: 0.7;
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0 0 24px;
		flex: 1;
	}

	.features li {
		font-size: 12px;
		color: var(--muted);
		padding: 6px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}

	.features li:last-child { border-bottom: none; }

	.cta {
		display: block;
		text-align: center;
		padding: 12px;
		border-radius: 100px;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 2px;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.2s;
		border: none;
		font-family: var(--sans);
	}

	.cta:hover { opacity: 0.85; }

	.cta-outline {
		background: transparent;
		color: var(--paper);
		border: 1px solid var(--line);
	}

	.cta-fill {
		background: #4a85ff;
		color: #fff;
	}

	.cta-disabled {
		background: transparent;
		color: var(--muted);
		border: 1px solid rgba(255, 255, 255, 0.06);
		opacity: 0.4;
		cursor: default;
	}

	.enterprise {
		text-align: center;
		margin-top: 40px;
		font-size: 13px;
		color: var(--muted);
	}

	.enterprise a {
		color: #4a85ff;
		text-decoration: none;
	}

	.enterprise a:hover { text-decoration: underline; }

	.footer-link {
		text-align: center;
		margin-top: 48px;
	}

	.footer-link a {
		color: rgba(244, 241, 234, 0.2);
		text-decoration: none;
		font-size: 10px;
		letter-spacing: 2.5px;
		text-transform: uppercase;
	}
	.premium-badge {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: #c8b432;
		background: rgba(200, 180, 50, 0.1);
		border: 1px solid rgba(200, 180, 50, 0.2);
		border-radius: 6px;
		padding: 4px 8px;
		margin-bottom: 16px;
		display: inline-block;
	}

	.features li.premium {
		color: #c8b432;
	}

	.wobbles-banner {
		display: flex;
		align-items: center;
		gap: 12px;
		background: rgba(200, 180, 50, 0.06);
		border: 1px solid rgba(200, 180, 50, 0.15);
		border-radius: 12px;
		padding: 16px 20px;
		margin-bottom: 32px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.wobble-logo {
		height: 32px;
		width: auto;
		flex-shrink: 0;
	}

	.wobbles-banner strong {
		display: block;
		font-size: 13px;
	}

	.wobble-sub {
		font-size: 11px;
		color: var(--muted);
	}

	.wobble-sub a {
		color: #4a85ff;
		text-decoration: none;
	}

	.wobble-count {
		color: #ea8238;
		font-weight: 600;
	}

	.usage-note {
		text-align: center;
		max-width: 500px;
		margin: 24px auto 0;
		font-size: 11px;
		color: var(--muted);
		line-height: 1.5;
	}
</style>

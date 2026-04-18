<svelte:head>
	<title>My Genie Account · Jelly-Claw</title>
</svelte:head>

<script>
	import { onMount } from 'svelte';

	let token = $state('');
	let loading = $state(true);
	let error = $state('');
	let user = $state(null);
	let username = $state('');
	let isWobblesOwner = $state(false);
	let upgradeLoading = $state('');

	const API_BASE = 'https://signal.jelly-claw.com';

	onMount(async () => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		token = params.get('token') || '';
		if (!token) { error = 'Open this page from the Jelly-Claw app.'; loading = false; return; }

		try {
			// Get profile
			const profileRes = await fetch('https://api.jellyjelly.com/user', {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!profileRes.ok) { error = 'Session expired. Reopen from the app.'; loading = false; return; }
			const profileData = await profileRes.json();
			username = profileData?.user?.username || '';
			isWobblesOwner = profileData?.wobbles_badge_no != null;

			// Get billing info
			await refreshBilling();
		} catch { error = 'Failed to load.'; }
		loading = false;
	});

	async function refreshBilling() {
		const res = await fetch(`${API_BASE}/genie/check`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, isWobblesOwner })
		});
		user = await res.json();
	}

	async function subscribe(tier) {
		upgradeLoading = tier;
		try {
			const res = await fetch(`${API_BASE}/genie/subscribe`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ tier })
			});
			const data = await res.json();
			if (data.checkoutUrl) window.location.href = data.checkoutUrl;
			else { alert(data.error || 'Something went wrong'); upgradeLoading = ''; }
		} catch { alert('Connection error.'); upgradeLoading = ''; }
	}

	async function openPortal() {
		const res = await fetch(`${API_BASE}/genie/portal`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` }
		});
		const data = await res.json();
		if (data.portalUrl) window.location.href = data.portalUrl;
	}

	function formatCost(n) { return typeof n === 'number' ? `$${n.toFixed(2)}` : '$0.00'; }
</script>

{#if loading}
	<div class="page center"><p class="muted">Loading...</p></div>
{:else if error}
	<div class="page center"><p class="error">{error}</p></div>
{:else if user}
	<div class="page">
		<div class="top-bar">
			<h1>My Genie</h1>
			<a href="/upgrade-genie#token={token}" class="manage-link">Change Plan →</a>
		</div>
		<p class="greeting">@{username}</p>

		<!-- Plan Card -->
		<div class="card plan-card">
			<div class="plan-header">
				<div>
					<span class="plan-name">{user.tierLabel}</span>
					{#if isWobblesOwner}
						<span class="wobbles-tag">WOBBLES</span>
					{/if}
				</div>
				{#if user.subscriptionStatus === 'active' && !isWobblesOwner}
					<button class="portal-btn" onclick={() => openPortal()}>MANAGE BILLING</button>
				{/if}
			</div>

			{#if isWobblesOwner && user.tier === 'creator'}
				<p class="plan-note">Creator free for life — you pay for usage only.</p>
			{/if}
		</div>

		<!-- Usage Card -->
		<div class="card">
			<div class="card-label">THIS MONTH</div>
			<div class="stats-row">
				<div class="stat">
					<span class="stat-val">{user.wishesUsed || 0}</span>
					<span class="stat-label">WISHES USED</span>
				</div>
				<div class="stat">
					<span class="stat-val">{user.wishesIncluded ?? '∞'}</span>
					<span class="stat-label">INCLUDED</span>
				</div>
				<div class="stat">
					<span class="stat-val">{user.wishesRemaining ?? '∞'}</span>
					<span class="stat-label">REMAINING</span>
				</div>
			</div>

			{#if user.wishesIncluded}
				<div class="progress-bar">
					<div class="progress-fill" style="width: {Math.min((user.wishesUsed / user.wishesIncluded) * 100, 100)}%; background: {user.wishesRemaining <= 3 ? '#ea8238' : '#4a85ff'}"></div>
				</div>
			{/if}

			{#if user.tier === 'free' && user.wishesUsed >= 7}
				<p class="warning">Running low on wishes. <a href="/upgrade-genie#token={token}">Upgrade now</a></p>
			{/if}
		</div>

		<!-- Upgrade Options (for free users) -->
		{#if user.tier === 'free'}
			<div class="card">
				<div class="card-label">UPGRADE</div>
				<div class="tier-options">
					<button class="tier-btn" onclick={() => subscribe('basic')} disabled={upgradeLoading === 'basic'}>
						<span class="tier-name">Basic</span>
						<span class="tier-price">$30/mo</span>
						<span class="tier-wishes">30 wishes</span>
					</button>
					<button class="tier-btn popular" onclick={() => subscribe('creator')} disabled={upgradeLoading === 'creator'}>
						<span class="tier-name">Creator</span>
						<span class="tier-price">$100/mo</span>
						<span class="tier-wishes">100 wishes</span>
					</button>
					<button class="tier-btn" onclick={() => subscribe('promaxxer')} disabled={upgradeLoading === 'promaxxer'}>
						<span class="tier-name">Pro Maxxer</span>
						<span class="tier-price">$500/mo</span>
						<span class="tier-wishes">Unlimited</span>
					</button>
				</div>
				<p class="usage-note">All plans pay for API usage at cost + 5%</p>
			</div>
		{/if}

		<!-- Wobbles -->
		{#if !isWobblesOwner}
			<div class="card wobbles-card">
				<div class="wobbles-content">
					<img src="/wobbles-logo.svg" alt="Wobbles" class="wobble-logo" />
					<div>
						<strong>Get a Wobble</strong>
						<p>Own a Wobble → Creator tier free for life. <span class="left">900 left</span></p>
					</div>
				</div>
				<a href="https://jellyjelly.com/wobbles" class="wobble-cta">BUY A WOBBLE</a>
			</div>
		{/if}

		<!-- Enterprise -->
		<div class="card enterprise-card">
			<div class="card-label">ENTERPRISE</div>
			<p class="enterprise-text">Need Genie for your team? We'll bring our model agency to help you deploy Genie across your enterprise.</p>
			<a href="mailto:iqram@imonsmalltalk.com" class="enterprise-cta">HIRE OUR MODEL AGENCY →</a>
		</div>

		<div class="footer-link">
			<a href="/">jelly-claw.com</a>
		</div>
	</div>
{/if}

<style>
	.page { max-width: 480px; margin: 0 auto; padding: 48px 24px; }
	.center { display: flex; justify-content: center; align-items: center; min-height: 50vh; }
	.muted { color: var(--muted); }
	.error { color: #ea8238; }

	.top-bar { display: flex; justify-content: space-between; align-items: baseline; }
	h1 { font-family: var(--display); font-size: 28px; font-weight: 400; }
	.manage-link { font-size: 11px; color: #4a85ff; text-decoration: none; letter-spacing: 1px; }
	.greeting { color: var(--muted); font-size: 13px; margin-bottom: 24px; }

	.card {
		background: var(--panel);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 14px;
		padding: 20px;
		margin-bottom: 16px;
	}

	.card-label {
		font-size: 9px; font-weight: 600; letter-spacing: 2.5px;
		color: var(--muted); margin-bottom: 12px;
	}

	.plan-card .plan-header {
		display: flex; justify-content: space-between; align-items: center;
	}
	.plan-name { font-family: var(--display); font-size: 24px; }
	.wobbles-tag {
		font-size: 8px; font-weight: 700; letter-spacing: 1.5px;
		color: #c8b432; background: rgba(200,180,50,0.12);
		padding: 2px 6px; border-radius: 3px; margin-left: 8px; vertical-align: middle;
	}
	.portal-btn {
		font-size: 9px; font-weight: 600; letter-spacing: 1.5px;
		color: #4a85ff; background: none; border: 1px solid rgba(74,133,255,0.3);
		padding: 5px 10px; border-radius: 100px; cursor: pointer; font-family: var(--sans);
	}
	.plan-note { font-size: 11px; color: var(--muted); margin-top: 6px; }

	.stats-row { display: flex; gap: 16px; }
	.stat { flex: 1; }
	.stat-val { display: block; font-family: var(--display); font-size: 28px; }
	.stat-label { font-size: 8px; font-weight: 600; letter-spacing: 2px; color: var(--muted); }

	.progress-bar {
		height: 5px; background: rgba(255,255,255,0.06); border-radius: 10px;
		margin-top: 12px; overflow: hidden;
	}
	.progress-fill { height: 100%; border-radius: 10px; transition: width 0.3s; }

	.warning { font-size: 11px; color: #ea8238; margin-top: 10px; }
	.warning a { color: #4a85ff; text-decoration: none; }

	.tier-options { display: flex; gap: 8px; }
	.tier-btn {
		flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 10px; padding: 14px 10px; cursor: pointer; text-align: center;
		font-family: var(--sans); color: var(--ink); transition: border-color 0.2s;
	}
	.tier-btn:hover { border-color: rgba(255,255,255,0.15); }
	.tier-btn.popular { border-color: rgba(74,133,255,0.4); }
	.tier-name { display: block; font-size: 13px; font-weight: 500; margin-bottom: 2px; }
	.tier-price { display: block; font-size: 11px; color: #4a85ff; }
	.tier-wishes { display: block; font-size: 9px; color: var(--muted); margin-top: 2px; }
	.usage-note { font-size: 10px; color: var(--muted); margin-top: 10px; text-align: center; }

	.wobbles-card { border-color: rgba(200,180,50,0.15); }
	.wobbles-content { display: flex; align-items: center; gap: 12px; }
	.wobble-logo { height: 28px; }
	.wobbles-content strong { font-size: 13px; display: block; }
	.wobbles-content p { font-size: 11px; color: var(--muted); margin: 2px 0 0; }
	.left { color: #ea8238; font-weight: 600; }
	.wobble-cta {
		display: block; text-align: center; margin-top: 12px;
		font-size: 10px; font-weight: 600; letter-spacing: 2px;
		color: #c8b432; text-decoration: none;
	}

	.enterprise-card { border-color: rgba(255,255,255,0.08); }
	.enterprise-text { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; }
	.enterprise-cta {
		font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
		color: #4a85ff; text-decoration: none;
	}

	.footer-link { text-align: center; margin-top: 32px; }
	.footer-link a { color: rgba(244,241,234,0.2); text-decoration: none; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; }
</style>

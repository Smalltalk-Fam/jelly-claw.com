<svelte:head>
	<title>{wish?.title || 'Genie Wish'} · {$page.params.username} · Jelly-Claw</title>
	<meta name="description" content={wish?.result?.slice(0, 160) || `A Genie wish by @${$page.params.username}`} />
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let wish = $state(null);
	let loading = $state(true);
	let error = $state('');
	let username = $state('');

	onMount(async () => {
		const id = $page.params.id;
		username = $page.params.username;
		try {
			const res = await fetch(`https://signal.jelly-claw.com/genie/wish/${id}`);
			if (!res.ok) {
				error = 'Wish not found';
				loading = false;
				return;
			}
			wish = await res.json();
			if (wish.error) {
				error = wish.error;
				wish = null;
			}
		} catch {
			error = 'Failed to load';
		}
		loading = false;
	});

	function linkify(text) {
		if (!text) return '';
		return text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
	}

	function timeAgo(dateStr) {
		if (!dateStr) return '';
		const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
		if (s < 60) return `${s}s ago`;
		if (s < 3600) return `${Math.floor(s / 60)}m ago`;
		if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
		return `${Math.floor(s / 86400)}d ago`;
	}

	function statusEmoji(status) {
		if (status === 'done') return '✨';
		if (status === 'running') return '⏳';
		if (status === 'errored') return '❌';
		return '🧞';
	}
</script>

<div class="page">
	{#if loading}
		<div class="center">
			<div class="spinner"></div>
		</div>
	{:else if error}
		<div class="center">
			<p class="error-text">{error}</p>
			<a href="/" class="back">← jelly-claw.com</a>
		</div>
	{:else if wish}
		<div class="wish-card">
			<div class="top-bar">
				<div></div>
				<span class="jellyfish">🪼</span>
			</div>

			<h1>{wish.title}</h1>

			<div class="meta">
				<span class="creator">@{wish.creator_username || username}</span>
				<span class="time">{timeAgo(wish.created_at)}</span>
				<span class="status {wish.status}">{statusEmoji(wish.status)} {wish.status}</span>
			</div>

			{#if wish.transcript}
				<div class="section">
					<div class="label">REQUEST</div>
					<p class="body">{@html linkify(wish.transcript)}</p>
				</div>
			{/if}

			{#if wish.result}
				<div class="section">
					<div class="label">🧞 RESULT</div>
					<p class="body">{@html linkify(wish.result)}</p>
				</div>
			{/if}

			{#if wish.error_message}
				<div class="section">
					<div class="label">ERROR</div>
					<p class="body error">{wish.error_message}</p>
				</div>
			{/if}

			<div class="details">
				{#if wish.model}
					<div class="detail"><span class="dl">Model</span> <span>{wish.model}</span></div>
				{/if}
				{#if wish.turns}
					<div class="detail"><span class="dl">Turns</span> <span>{wish.turns}</span></div>
				{/if}
				{#if wish.usd_cost}
					<div class="detail"><span class="dl">Cost</span> <span>${wish.usd_cost.toFixed(3)}</span></div>
				{/if}
			</div>

			<div class="links">
				<a href={wish.jelly_url} target="_blank" rel="noopener" class="link-btn">Watch on JellyJelly ↗</a>
			</div>
		</div>

		<div class="footer">
			<a href="https://jelly-claw.com" class="back">jelly-claw.com</a>
		</div>
	{/if}
</div>

<style>
	.page {
		min-height: 100vh;
		background: #0a0a0a;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 20px;
		font-family: -apple-system, SF Pro, system-ui, sans-serif;
		color: #e8e4dc;
	}
	.center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40vh; gap: 16px; }
	.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #8aa9f5; border-radius: 50%; animation: spin 0.8s linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }
	.error-text { color: #ea8238; font-size: 14px; }
	.back { color: #8aa9f5; text-decoration: none; font-size: 12px; }
	.back:hover { text-decoration: underline; }
	.wish-card { max-width: 560px; width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; }
	.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
	.jellyfish { font-size: 24px; }
	h1 { font-size: 20px; font-weight: 500; margin: 0 0 12px; line-height: 1.35; width: 100%; }
	.meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 24px; }
	.creator { color: #8aa9f5; font-size: 12px; }
	.time { color: rgba(255,255,255,0.25); font-size: 11px; }
	.status { font-size: 10px; padding: 2px 8px; border-radius: 10px; background: rgba(255,255,255,0.05); }
	.status.done { color: #34c759; }
	.status.running { color: #8aa9f5; }
	.status.errored { color: #ea8238; }
	.section { margin-bottom: 20px; }
	.label { font-size: 9px; font-weight: 600; letter-spacing: 2px; color: rgba(255,255,255,0.3); margin-bottom: 6px; }
	.body { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.75); white-space: pre-wrap; word-break: break-word; margin: 0; }
	.body :global(a) { color: #8aa9f5; text-decoration: none; }
	.body :global(a:hover) { text-decoration: underline; }
	.body.error { color: #ea8238; }
	.details { display: flex; gap: 20px; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05); margin-bottom: 16px; }
	.detail { display: flex; flex-direction: column; gap: 2px; }
	.dl { font-size: 9px; letter-spacing: 1px; color: rgba(255,255,255,0.25); text-transform: uppercase; }
	.detail span:last-child { font-size: 12px; font-family: SF Mono, Menlo, monospace; color: rgba(255,255,255,0.6); }
	.links { display: flex; gap: 8px; }
	.link-btn { display: inline-block; font-size: 11px; font-weight: 500; color: #8aa9f5; padding: 8px 16px; border: 1px solid rgba(138,169,245,0.2); border-radius: 8px; text-decoration: none; background: rgba(138,169,245,0.04); }
	.link-btn:hover { background: rgba(138,169,245,0.1); }
	.footer { margin-top: 32px; text-align: center; }
</style>

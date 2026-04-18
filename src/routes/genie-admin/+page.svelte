<svelte:head>
	<title>Genie Admin · Jelly-Claw</title>
</svelte:head>

<script>
	import { onMount } from 'svelte';

	let token = $state('');
	let authorized = $state(false);
	let loading = $state(true);
	let users = $state([]);
	let error = $state('');

	const ADMIN_USERNAME = 'iqram';
	const API_BASE = 'https://signal.jelly-claw.com';
	const SUPABASE_URL = 'https://cbtzdoasmkbbiwnyoxvz.supabase.co';

	onMount(async () => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		token = params.get('token') || '';

		if (!token) {
			error = 'No auth token. Open this page from the Jelly-Claw app.';
			loading = false;
			return;
		}

		// Verify identity via Jelly API + load users via Worker (which does the real admin check)
		try {
			const profileRes = await fetch('https://api.jellyjelly.com/user', {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!profileRes.ok) {
				error = 'Invalid token.';
				loading = false;
				return;
			}
			const profileData = await profileRes.json();
			const username = profileData?.user?.username || '';

			if (username !== ADMIN_USERNAME) {
				error = 'Access denied.';
				loading = false;
				return;
			}

			authorized = true;
			await loadUsers();
		} catch (e) {
			error = 'Auth failed.';
		}
		loading = false;
	});

	async function loadUsers() {
		try {
			const res = await fetch(`${API_BASE}/genie/admin/users`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			users = data.users || [];
		} catch {
			error = 'Failed to load users.';
		}
	}

	function formatCost(n) {
		return typeof n === 'number' ? `$${n.toFixed(2)}` : '$0.00';
	}
</script>

{#if loading}
	<div class="page"><p class="muted">Loading...</p></div>
{:else if error}
	<div class="page"><p class="error">{error}</p></div>
{:else if authorized}
	<div class="page">
		<h1>Genie Admin</h1>
		<p class="muted">{users.length} users</p>

		<table>
			<thead>
				<tr>
					<th>User</th>
					<th>Tier</th>
					<th>Status</th>
					<th>Wishes</th>
					<th>Spend</th>
					<th>Joined</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user}
					<tr>
						<td class="username">@{user.jelly_username || user.user_id?.slice(0,8) || '?'}</td>
						<td><span class="badge {user.tier}">{user.tier}</span></td>
						<td><span class="status {user.subscription_status}">{user.subscription_status}</span></td>
						<td>{user.wishes_used || 0} / {user.wishes_included ?? '∞'}</td>
						<td class="mono">{formatCost(user.spend_this_month)}</td>
						<td class="mono">{user.created_at?.slice(0,10) || '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="summary">
			<div class="stat">
				<span class="stat-value">{users.length}</span>
				<span class="stat-label">TOTAL USERS</span>
			</div>
			<div class="stat">
				<span class="stat-value">{users.filter(u => u.subscription_status === 'active').length}</span>
				<span class="stat-label">PAYING</span>
			</div>
			<div class="stat">
				<span class="stat-value">{formatCost(users.reduce((s, u) => s + (u.spend_this_month || 0), 0))}</span>
				<span class="stat-label">TOTAL SPEND</span>
			</div>
			<div class="stat">
				<span class="stat-value">{users.reduce((s, u) => s + (u.wishes_used || 0), 0)}</span>
				<span class="stat-label">TOTAL WISHES</span>
			</div>
		</div>

		<button class="refresh" onclick={() => loadUsers()}>REFRESH</button>
	</div>
{/if}

<style>
	.page {
		max-width: 700px;
		margin: 0 auto;
		padding: 60px 24px;
	}

	h1 {
		font-family: var(--display);
		font-size: 28px;
		font-weight: 400;
		margin-bottom: 4px;
	}

	.muted { color: var(--muted); font-size: 13px; }
	.error { color: #ea8238; font-size: 14px; }

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 24px;
		font-size: 12px;
	}

	th {
		text-align: left;
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--muted);
		padding: 8px 6px;
		border-bottom: 1px solid rgba(255,255,255,0.08);
	}

	td {
		padding: 10px 6px;
		border-bottom: 1px solid rgba(255,255,255,0.04);
		color: var(--ink);
	}

	.username { font-weight: 500; }
	.mono { font-family: 'SF Mono', monospace; font-size: 11px; }

	.badge {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 1px;
		text-transform: uppercase;
		padding: 2px 6px;
		border-radius: 4px;
	}

	.badge.free { background: rgba(255,255,255,0.06); color: var(--muted); }
	.badge.starter { background: rgba(74,133,255,0.12); color: #4a85ff; }
	.badge.growth { background: rgba(74,133,255,0.2); color: #4a85ff; }
	.badge.unlimited { background: rgba(200,180,50,0.15); color: #c8b432; }

	.status {
		font-size: 10px;
	}
	.status.active { color: #4ade80; }
	.status.none { color: var(--muted); }
	.status.canceled { color: #ea8238; }
	.status.past_due { color: #ef4444; }

	.summary {
		display: flex;
		gap: 16px;
		margin-top: 32px;
		flex-wrap: wrap;
	}

	.stat {
		background: var(--panel);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 10px;
		padding: 16px 20px;
		flex: 1;
		min-width: 120px;
	}

	.stat-value {
		display: block;
		font-family: var(--display);
		font-size: 24px;
	}

	.stat-label {
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 2px;
		color: var(--muted);
	}

	.refresh {
		margin-top: 24px;
		background: transparent;
		border: 1px solid rgba(255,255,255,0.1);
		color: var(--muted);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 2px;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-family: var(--sans);
	}
	.refresh:hover { border-color: rgba(255,255,255,0.2); color: var(--ink); }
</style>

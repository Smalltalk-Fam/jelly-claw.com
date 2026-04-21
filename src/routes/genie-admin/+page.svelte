<svelte:head>
	<title>Genie Admin · Jelly-Claw</title>
</svelte:head>

<script>
	import { onMount } from 'svelte';

	let token = $state('');
	let authorized = $state(false);
	let loading = $state(true);
	let users = $state([]);
	let dispatches = $state([]);
	let friends = $state([]);
	let error = $state('');
	let tab = $state('users');
	let expandedDispatch = $state(null);
	let logs = $state([]);
	let logFilter = $state('');
	let logLines = $state(150);
	let logsLoading = $state(false);
	let logsAutoRefresh = $state(null);

	const ADMIN_USERNAME = 'iqram';
	const API_BASE = 'https://signal.jelly-claw.com';

	onMount(async () => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		token = params.get('token') || '';

		if (!token) {
			error = 'No auth token. Open this page from the Jelly-Claw app.';
			loading = false;
			return;
		}

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
			await Promise.all([loadUsers(), loadDispatches(), loadFriends()]);
		} catch (e) {
			error = 'Auth failed.';
		}
		loading = false;
	});

	async function loadUsers() {
		try {
			const res = await fetch(`${API_BASE}/genie/admin/users`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
			});
			const data = await res.json();
			users = data.users || [];
		} catch { error = 'Failed to load users.'; }
	}

	async function loadDispatches() {
		try {
			const res = await fetch(`${API_BASE}/genie/admin/dispatches`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
			});
			const data = await res.json();
			dispatches = data.dispatches || [];
		} catch {}
	}

	let userMap = $state({});

	async function loadFriends() {
		try {
			const res = await fetch(`${API_BASE}/genie/admin/friends`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
			});
			const data = await res.json();
			friends = data.friends || [];
			await resolveUsernames(friends);
		} catch {}
	}

	async function resolveUsernames(friendsList) {
		// Build map from genie_users first
		for (const u of users) {
			if (u.user_id) userMap[u.user_id] = { username: u.jelly_username || '', fullName: u.full_name || '' };
		}
		// Collect unknown IDs
		const unknownIds = new Set();
		for (const f of friendsList) {
			if (f.user_id && !userMap[f.user_id]) unknownIds.add(f.user_id);
			if (f.friend_id && !userMap[f.friend_id]) unknownIds.add(f.friend_id);
		}
		// Resolve via Jelly API
		for (const uid of unknownIds) {
			try {
				const res = await fetch(`https://api.jellyjelly.com/user/${uid}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.ok) {
					const data = await res.json();
					const u = data?.user || {};
					userMap[uid] = { username: u.username || '', fullName: u.full_name || '' };
				}
			} catch {}
		}
		userMap = { ...userMap }; // trigger reactivity
	}

	function displayUser(uid) {
		const u = userMap[uid];
		if (u?.username) return `@${u.username}`;
		return uid?.slice(0, 8) || '?';
	}

	function displayFullName(uid) {
		return userMap[uid]?.fullName || '';
	}

	function formatCost(n) {
		return typeof n === 'number' ? `$${n.toFixed(2)}` : '$0.00';
	}

	function timeAgo(dateStr) {
		if (!dateStr) return '—';
		const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
		if (s < 60) return `${s}s ago`;
		if (s < 3600) return `${Math.floor(s / 60)}m ago`;
		if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
		return `${Math.floor(s / 86400)}d ago`;
	}

	async function markAllDone() {
		try {
			await fetch(`${API_BASE}/genie/admin/mark-done`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
			});
			await loadDispatches();
		} catch {}
	}

	async function loadLogs() {
		logsLoading = true;
		try {
			const params = new URLSearchParams({ lines: logLines.toString() });
			if (logFilter) params.set('filter', logFilter);
			const res = await fetch(`http://127.0.0.1:7778/logs?${params}`);
			const data = await res.json();
			logs = data.lines || [];
		} catch (e) {
			logs = [`⚠ Could not reach local genie server (http://127.0.0.1:7778). Make sure it's running.`];
		}
		logsLoading = false;
	}

	function startLogAutoRefresh() {
		stopLogAutoRefresh();
		logsAutoRefresh = setInterval(loadLogs, 5000);
	}

	function stopLogAutoRefresh() {
		if (logsAutoRefresh) { clearInterval(logsAutoRefresh); logsAutoRefresh = null; }
	}

	function classifyLog(line) {
		if (line.includes('[ERROR]') || line.includes('error') || line.includes('failed')) return 'log-error';
		if (line.includes('[KEYWORD]') || line.includes('DETECTED')) return 'log-keyword';
		if (line.includes('[EXEC]') || line.includes('[DISPATCH')) return 'log-dispatch';
		if (line.includes('Sent as Genie') || line.includes('[CHAT]')) return 'log-chat';
		if (line.includes('[POLL]')) return 'log-poll';
		if (line.includes('[INIT]') || line.includes('started')) return 'log-init';
		return '';
	}

	function refresh() {
		if (tab === 'users') loadUsers();
		else if (tab === 'requests') loadDispatches();
		else if (tab === 'friends') loadFriends();
		else if (tab === 'logs') loadLogs();
	}
</script>

{#if loading}
	<div class="page"><p class="muted">Loading...</p></div>
{:else if error}
	<div class="page"><p class="error">{error}</p></div>
{:else if authorized}
	<div class="page">
		<div class="header">
			<h1>Genie Admin</h1>
			<div class="tabs">
				<button class="tab" class:active={tab === 'users'} onclick={() => tab = 'users'}>
					USERS <span class="count">{users.length}</span>
				</button>
				<button class="tab" class:active={tab === 'requests'} onclick={() => tab = 'requests'}>
					REQUESTS <span class="count">{dispatches.length}</span>
				</button>
				<button class="tab" class:active={tab === 'friends'} onclick={() => tab = 'friends'}>
					CONNECTIONS <span class="count">{friends.length}</span>
				</button>
				<button class="tab" class:active={tab === 'logs'} onclick={() => { tab = 'logs'; loadLogs(); }}>
					LOGS
				</button>
			</div>
		</div>

		{#if tab === 'users'}
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

		{:else if tab === 'requests'}
			<table>
				<thead>
					<tr>
						<th>Creator</th>
						<th>Request</th>
						<th>Status</th>
						<th>Model</th>
						<th>Cost</th>
						<th>Turns</th>
						<th>When</th>
					</tr>
				</thead>
				<tbody>
					{#each dispatches as d}
						<tr onclick={() => expandedDispatch = expandedDispatch === d.clip_id ? null : d.clip_id} class="clickable">
							<td class="username">@{d.creator_username || '?'}</td>
							<td class="title">{d.title || '(untitled)'}</td>
							<td><span class="status {d.status}">{d.status}</span></td>
							<td class="mono">{d.model || '—'}</td>
							<td class="mono">{d.usd_cost ? `$${d.usd_cost.toFixed(3)}` : '—'}</td>
							<td class="mono">{d.turns || '—'}</td>
							<td class="mono">{timeAgo(d.created_at)}</td>
						</tr>
						{#if expandedDispatch === d.clip_id}
							<tr class="expanded-row">
								<td colspan="7">
									<div class="expanded-detail">
										<div class="detail-section">
											<span class="detail-label">CLIP ID</span>
											<span class="mono">{d.clip_id}</span>
										</div>
										{#if d.transcript}
											<div class="detail-section">
												<span class="detail-label">FULL REQUEST</span>
												<p class="transcript">{d.transcript}</p>
											</div>
										{/if}
										{#if d.result}
											<div class="detail-section">
												<span class="detail-label">RESULT</span>
												<p class="transcript">{d.result}</p>
											</div>
										{/if}
										{#if d.error_message}
											<div class="detail-section">
												<span class="detail-label">ERROR</span>
												<p class="error">{d.error_message}</p>
											</div>
										{/if}
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>

			<div class="summary">
				<div class="stat">
					<span class="stat-value">{dispatches.length}</span>
					<span class="stat-label">TOTAL</span>
				</div>
				<div class="stat">
					<span class="stat-value">{dispatches.filter(d => d.status === 'done').length}</span>
					<span class="stat-label">DONE</span>
				</div>
				<div class="stat">
					<span class="stat-value">{dispatches.filter(d => d.status === 'running').length}</span>
					<span class="stat-label">RUNNING</span>
				</div>
				<div class="stat">
					<span class="stat-value">{formatCost(dispatches.reduce((s, d) => s + (d.usd_cost || 0), 0))}</span>
					<span class="stat-label">TOTAL COST</span>
				</div>
			</div>

			{#if dispatches.filter(d => d.status === 'running').length > 0}
				<button class="refresh mark-done" onclick={markAllDone}>
					MARK ALL RUNNING AS DONE ({dispatches.filter(d => d.status === 'running').length})
				</button>
			{/if}

		{:else if tab === 'friends'}
			<table>
				<thead>
					<tr>
						<th>User</th>
						<th>Friend</th>
						<th>Relationship</th>
						<th>Company</th>
						<th>Matched</th>
						<th>Added</th>
					</tr>
				</thead>
				<tbody>
					{#each friends as f}
						<tr>
							<td>
								<span class="username">{displayUser(f.user_id)}</span>
								{#if displayFullName(f.user_id)}
									<span class="fullname">{displayFullName(f.user_id)}</span>
								{/if}
							</td>
							<td>
								<span class="username">{displayUser(f.friend_id)}</span>
								{#if displayFullName(f.friend_id)}
									<span class="fullname">{displayFullName(f.friend_id)}</span>
								{/if}
							</td>
							<td><span class="badge relationship">{f.relationship?.replace(/_/g, ' ') || '—'}</span></td>
							<td>{f.genie_companies?.name || '—'}</td>
							<td>{f.is_matched ? '✅' : '—'}</td>
							<td class="mono">{timeAgo(f.created_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<div class="summary">
				<div class="stat">
					<span class="stat-value">{friends.length}</span>
					<span class="stat-label">CONNECTIONS</span>
				</div>
				<div class="stat">
					<span class="stat-value">{friends.filter(f => f.is_matched).length}</span>
					<span class="stat-label">MATCHED</span>
				</div>
				<div class="stat">
					<span class="stat-value">{new Set(friends.map(f => f.genie_companies?.name).filter(Boolean)).size}</span>
					<span class="stat-label">COMPANIES</span>
				</div>
				<div class="stat">
					<span class="stat-value">{new Set([...friends.map(f => f.user_id), ...friends.map(f => f.friend_id)]).size}</span>
					<span class="stat-label">UNIQUE USERS</span>
				</div>
			</div>

		{:else if tab === 'logs'}
			<div class="log-controls">
				<input class="log-filter" type="text" placeholder="Filter (regex)..." bind:value={logFilter} onkeydown={(e) => e.key === 'Enter' && loadLogs()} />
				<select class="log-select" bind:value={logLines} onchange={loadLogs}>
					<option value={50}>50 lines</option>
					<option value={150}>150 lines</option>
					<option value={500}>500 lines</option>
					<option value={1000}>1000 lines</option>
				</select>
				<button class="tab" class:active={logsAutoRefresh} onclick={() => logsAutoRefresh ? stopLogAutoRefresh() : startLogAutoRefresh()}>
					{logsAutoRefresh ? '⏸ PAUSE' : '▶ LIVE'}
				</button>
			</div>

			<div class="log-quick-filters">
				<button class="log-chip" onclick={() => { logFilter = 'ERROR|failed|error'; loadLogs(); }}>ERRORS</button>
				<button class="log-chip" onclick={() => { logFilter = 'KEYWORD|DETECTED'; loadLogs(); }}>KEYWORDS</button>
				<button class="log-chip" onclick={() => { logFilter = 'EXEC|DISPATCH'; loadLogs(); }}>DISPATCHES</button>
				<button class="log-chip" onclick={() => { logFilter = 'Sent as Genie|CHAT'; loadLogs(); }}>CHAT</button>
				<button class="log-chip" onclick={() => { logFilter = 'Queued|dropping|draining'; loadLogs(); }}>QUEUE</button>
				<button class="log-chip" onclick={() => { logFilter = ''; loadLogs(); }}>ALL</button>
			</div>

			<pre class="log-output">{#if logsLoading}<span class="muted">Loading...</span>{:else}{#each logs as line}<span class={classifyLog(line)}>{line}</span>
{/each}{/if}</pre>
		{/if}

		<button class="refresh" onclick={refresh}>REFRESH</button>
	</div>
{/if}

<style>
	.page {
		max-width: 800px;
		margin: 0 auto;
		padding: 60px 24px;
	}

	.header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	h1 {
		font-family: var(--display);
		font-size: 28px;
		font-weight: 400;
		margin: 0;
	}

	.tabs {
		display: flex;
		gap: 4px;
	}

	.tab {
		background: transparent;
		border: 1px solid rgba(255,255,255,0.08);
		color: var(--muted);
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 1.6px;
		padding: 6px 12px;
		border-radius: 6px;
		cursor: pointer;
		font-family: var(--sans);
		transition: all 0.15s;
	}
	.tab:hover { border-color: rgba(255,255,255,0.15); color: var(--ink); }
	.tab.active { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); color: var(--ink); }

	.count {
		opacity: 0.5;
		font-size: 9px;
	}

	.muted { color: var(--muted); font-size: 13px; }
	.error { color: #ea8238; font-size: 14px; }

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 16px;
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
	.fullname { display: block; font-size: 10px; color: var(--muted); }
	.mono { font-family: 'SF Mono', monospace; font-size: 11px; }
	.clip-id { font-size: 10px; opacity: 0.6; }
	.title { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
	.badge.relationship { background: rgba(234,130,56,0.1); color: #ea8238; }

	.status { font-size: 10px; }
	.status.active, .status.done { color: #4ade80; }
	.status.none { color: var(--muted); }
	.status.canceled, .status.cancelled, .status.error { color: #ea8238; }
	.status.past_due { color: #ef4444; }
	.status.running, .status.pending { color: #4a85ff; }

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

	.mark-done { border-color: rgba(74,133,255,0.3); color: #4a85ff; }
	.mark-done:hover { border-color: rgba(74,133,255,0.5); }

	/* Logs */
	.log-controls { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
	.log-filter {
		flex: 1; background: var(--panel); border: 1px solid rgba(255,255,255,0.08);
		color: var(--ink); font-family: 'SF Mono', monospace; font-size: 11px;
		padding: 6px 10px; border-radius: 6px; outline: none;
	}
	.log-filter:focus { border-color: rgba(255,255,255,0.2); }
	.log-select {
		background: var(--panel); border: 1px solid rgba(255,255,255,0.08);
		color: var(--muted); font-size: 10px; padding: 6px 8px; border-radius: 6px;
	}
	.log-quick-filters { display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap; }
	.log-chip {
		background: transparent; border: 1px solid rgba(255,255,255,0.08);
		color: var(--muted); font-size: 8px; font-weight: 600; letter-spacing: 1.2px;
		padding: 3px 8px; border-radius: 4px; cursor: pointer; font-family: var(--sans);
	}
	.log-chip:hover { border-color: rgba(255,255,255,0.2); color: var(--ink); }
	.log-output {
		background: #0a0a0a; border: 1px solid rgba(255,255,255,0.06);
		border-radius: 8px; padding: 16px; font-family: 'SF Mono', 'Menlo', monospace;
		font-size: 10px; line-height: 1.6; color: rgba(255,255,255,0.5);
		max-height: 600px; overflow-y: auto; white-space: pre-wrap; word-break: break-all;
	}
	.log-error { color: #ef4444; }
	.log-keyword { color: #facc15; }
	.log-dispatch { color: #4a85ff; }
	.log-chat { color: #4ade80; }
	.log-poll { color: rgba(255,255,255,0.25); }
	.log-init { color: #a78bfa; }

	.clickable { cursor: pointer; }
	.clickable:hover td { background: rgba(255,255,255,0.02); }

	.expanded-row td { padding: 0 !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
	.expanded-detail { padding: 12px 16px; background: rgba(255,255,255,0.02); }
	.detail-section { margin-bottom: 10px; }
	.detail-label { display: block; font-size: 8px; font-weight: 600; letter-spacing: 1.6px; color: var(--muted); margin-bottom: 4px; }
	.transcript { font-size: 11px; color: var(--ink); line-height: 1.5; white-space: pre-wrap; word-break: break-word; margin: 0; }
</style>

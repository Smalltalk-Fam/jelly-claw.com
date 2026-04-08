/** @type {import('./$types').PageServerLoad} */
export async function load({ request }) {
	const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
	const parts = host.split('.');

	// Check if this is a subdomain (e.g., iqram.jelly-claw.com)
	// Must have at least 3 parts and not be 'www'
	const isSubdomain = parts.length >= 3 && parts[0] !== 'www';
	const username = isSubdomain ? parts[0] : null;

	if (!username) {
		// Regular landing page — no profile data needed
		return { profile: null };
	}

	// Fetch user's jellies from the API
	try {
		const res = await fetch(
			`https://api.jellyjelly.com/v3/jelly/search?username=${encodeURIComponent(username)}&page_size=12&sort_by=date`
		);
		if (!res.ok) {
			return { profile: { username, error: true } };
		}
		const data = await res.json();
		const jellies = data.jellies || [];

		// Extract user info from the first jelly's participants
		const user = jellies.length > 0
			? jellies[0].participants?.find(p => p.username === username)
			: null;

		return {
			profile: {
				username,
				fullName: user?.full_name || username,
				pfpUrl: user?.pfp_url || null,
				totalJellies: data.total || 0,
				jellies: jellies.map(j => ({
					id: j.id,
					title: j.title || '',
					thumbnailUrl: j.thumbnail_url || '',
					postedAt: j.posted_at || ''
				}))
			}
		};
	} catch {
		return { profile: { username, error: true } };
	}
}

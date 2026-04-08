import cloudflare from '@sveltejs/adapter-cloudflare';
import auto from '@sveltejs/adapter-auto';

const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: isDev ? auto() : cloudflare(),
	},
};

export default config;

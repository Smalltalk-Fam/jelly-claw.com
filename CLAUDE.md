# Jelly-Claw.com

SvelteKit site deployed to Cloudflare Pages.

## Deploy

When asked to deploy, push, or ship to production, run these steps:

1. Commit any uncommitted changes
2. Push to GitHub: `git push origin main`
3. Build: `npm run build`
4. Deploy to Cloudflare: `npx wrangler pages deploy .svelte-kit/cloudflare --project-name=jelly-claw-com`

Always do all three — GitHub is the source of truth, Cloudflare Pages is the live site.

## Dev

```bash
npm run dev
```

## Stack

- SvelteKit with `@sveltejs/adapter-cloudflare`
- Cloudflare Pages (project: `jelly-claw-com`)
- Wrangler CLI for deploys

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const src = url.searchParams.get('url');
  if (!src) return new Response('Missing url param', { status: 400 });

  const res = await fetch(src);
  if (!res.ok) return new Response('Failed to fetch image', { status: 502 });

  return new Response(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

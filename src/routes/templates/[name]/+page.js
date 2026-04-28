const templates = {
  'jelly-as-tweet': {
    title: 'Jelly as Tweet',
    description: 'Turn any jelly into a shareable tweet-style card.',
    bg: '#1a6bff',
    border: '#0a3d99',
    padding: 40,
  },
};

/** @type {import('./$types').PageLoad} */
export function load({ params, url }) {
  const template = templates[params.name];
  if (!template) {
    return { notFound: true, name: params.name };
  }
  return {
    template,
    name: params.name,
    prefillUsername: url.searchParams.get('username') || '',
    prefillText: url.searchParams.get('text') || '',
  };
}

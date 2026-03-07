export const config = { runtime: 'edge' };

const SITE = 'https://datsfilipe.xyz';

interface PageMeta {
  title: string;
  description: string;
  image: string;
  url: string;
}

function ogImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set('subtitle', subtitle);
  return `${SITE}/api/og?${params.toString()}`;
}

const DEFAULTS: PageMeta = {
  title: 'Filipe Lima',
  description: 'Full-stack developer. Blog, projects, and rices.',
  image: ogImageUrl('Filipe Lima'),
  url: SITE,
};

async function getMetaForPath(pathname: string): Promise<PageMeta> {
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);

  if (!blogMatch && !projectMatch) {
    const staticPages: Record<string, PageMeta> = {
      '/': DEFAULTS,
      '/blog': {
        title: 'Blog — datsfilipe',
        description: 'Articles about programming, Linux, and other things.',
        image: ogImageUrl('Blog'),
        url: `${SITE}/blog`,
      },
      '/projects': {
        title: 'Projects — datsfilipe',
        description: 'Active open-source projects by Filipe Lima.',
        image: ogImageUrl('Projects'),
        url: `${SITE}/projects`,
      },
      '/rices': {
        title: 'Rices — datsfilipe',
        description: 'Linux desktop customization gallery.',
        image: ogImageUrl('Rices'),
        url: `${SITE}/rices`,
      },
    };
    return staticPages[pathname] || DEFAULTS;
  }

  try {
    const res = await fetch(`${SITE}/metadata.json`);
    if (!res.ok) return DEFAULTS;
    const metadata = await res.json();

    if (blogMatch) {
      const post = metadata.posts?.[blogMatch[1]];
      if (post) {
        return {
          title: `${post.title} — datsfilipe`,
          description: `${post.title} · ${post.date}`,
          image: ogImageUrl(post.title, post.date),
          url: `${SITE}/blog/${blogMatch[1]}`,
        };
      }
    }

    if (projectMatch) {
      const project = metadata.projects?.[projectMatch[1]];
      if (project) {
        return {
          title: `${project.title} — datsfilipe`,
          description: `${project.title} · ${project.version}`,
          image: ogImageUrl(project.title, `${project.date}  ·  ${project.version}`),
          url: `${SITE}/projects/${projectMatch[1]}`,
        };
      }
    }
  } catch {
    // fall through to defaults
  }

  return DEFAULTS;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const meta = await getMetaForPath(url.pathname);

  const htmlRes = await fetch(`${url.origin}/index.html`);
  let html = await htmlRes.text();

  html = html
    .replace(/__OG_TITLE__/g, meta.title)
    .replace(/__OG_DESCRIPTION__/g, meta.description)
    .replace(/__OG_IMAGE__/g, meta.image)
    .replace(/__OG_URL__/g, meta.url);

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

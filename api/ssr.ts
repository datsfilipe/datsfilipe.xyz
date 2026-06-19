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

const STATIC_PAGES: Record<string, PageMeta> = {
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

async function getMetadata(origin: string) {
  try {
    const res = await fetch(`${origin}/metadata.json`);
    return (await res.json()) as {
      posts: Record<string, { title: string; date: string }>;
      projects: Record<string, { title: string; version: string; date: string }>;
    };
  } catch {
    return { posts: {}, projects: {} };
  }
}

interface RiceMeta {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  fullImage?: string;
}

async function getRicesMetadata(origin: string): Promise<RiceMeta[]> {
  try {
    const res = await fetch(`${origin}/rices/metadata.json`);
    return (await res.json()) as RiceMeta[];
  } catch {
    return [];
  }
}

function getMetaForPath(
  pathname: string,
  searchParams: URLSearchParams,
  metadata: Awaited<ReturnType<typeof getMetadata>>,
  rices: RiceMeta[],
): PageMeta {
  // A shared rice link (/rices?rice=<id>) previews the rice screenshot itself.
  if (pathname === '/rices') {
    const riceId = searchParams.get('rice');
    if (riceId) {
      const rice = rices.find((r) => r.id === riceId);
      if (rice) {
        return {
          title: `${rice.title} — datsfilipe`,
          description: rice.subtitle,
          image: `${SITE}/rices/${rice.file}`,
          url: `${SITE}/rices?rice=${rice.id}`,
        };
      }
    }
  }

  if (STATIC_PAGES[pathname]) return STATIC_PAGES[pathname];

  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = metadata.posts[blogMatch[1]];
    if (post) {
      return {
        title: `${post.title} — datsfilipe`,
        description: `${post.title} · ${post.date}`,
        image: ogImageUrl(post.title, post.date),
        url: `${SITE}/blog/${blogMatch[1]}`,
      };
    }
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const project = metadata.projects[projectMatch[1]];
    if (project) {
      return {
        title: `${project.title} — datsfilipe`,
        description: `${project.title} · ${project.version}`,
        image: ogImageUrl(project.title, `${project.date}  ·  ${project.version}`),
        url: `${SITE}/projects/${projectMatch[1]}`,
      };
    }
  }

  return DEFAULTS;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const [htmlRes, metadata, rices] = await Promise.all([
    fetch(`${origin}/index.html`),
    getMetadata(origin),
    getRicesMetadata(origin),
  ]);

  let html = await htmlRes.text();
  const meta = getMetaForPath(url.pathname, url.searchParams, metadata, rices);

  html = html
    .replace(/__OG_TITLE__/g, meta.title)
    .replace(/__OG_DESCRIPTION__/g, meta.description)
    .replace(/__OG_IMAGE__/g, meta.image)
    .replace(/__OG_URL__/g, meta.url);

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

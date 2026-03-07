import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { posts } from './src/app/data/posts';
import { projects } from './src/app/data/projects';

function getMetadata() {
  return {
    posts: Object.fromEntries(posts.map((p) => [p.id, { title: p.title, date: p.date }])),
    projects: Object.fromEntries(
      projects.map((p) => [p.id, { title: p.title, version: p.version, date: p.date }]),
    ),
  };
}

function generateSsr(html: string, metadata: ReturnType<typeof getMetadata>) {
  const escapedHtml = JSON.stringify(html);
  const escapedMeta = JSON.stringify(metadata);

  return `const SITE = 'https://datsfilipe.xyz';

const indexHtml = ${escapedHtml};
const metadata = ${escapedMeta};

function ogImageUrl(title, subtitle) {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set('subtitle', subtitle);
  return SITE + '/api/og?' + params.toString();
}

const DEFAULTS = {
  title: 'Filipe Lima',
  description: 'Full-stack developer. Blog, projects, and rices.',
  image: ogImageUrl('Filipe Lima'),
  url: SITE,
};

function getMetaForPath(pathname) {
  const staticPages = {
    '/': DEFAULTS,
    '/blog': {
      title: 'Blog — datsfilipe',
      description: 'Articles about programming, Linux, and other things.',
      image: ogImageUrl('Blog'),
      url: SITE + '/blog',
    },
    '/projects': {
      title: 'Projects — datsfilipe',
      description: 'Active open-source projects by Filipe Lima.',
      image: ogImageUrl('Projects'),
      url: SITE + '/projects',
    },
    '/rices': {
      title: 'Rices — datsfilipe',
      description: 'Linux desktop customization gallery.',
      image: ogImageUrl('Rices'),
      url: SITE + '/rices',
    },
  };

  if (staticPages[pathname]) return staticPages[pathname];

  const blogMatch = pathname.match(/^\\/blog\\/([^/]+)$/);
  if (blogMatch) {
    const post = metadata.posts[blogMatch[1]];
    if (post) {
      return {
        title: post.title + ' — datsfilipe',
        description: post.title + ' · ' + post.date,
        image: ogImageUrl(post.title, post.date),
        url: SITE + '/blog/' + blogMatch[1],
      };
    }
  }

  const projectMatch = pathname.match(/^\\/projects\\/([^/]+)$/);
  if (projectMatch) {
    const project = metadata.projects[projectMatch[1]];
    if (project) {
      return {
        title: project.title + ' — datsfilipe',
        description: project.title + ' · ' + project.version,
        image: ogImageUrl(project.title, project.date + '  ·  ' + project.version),
        url: SITE + '/projects/' + projectMatch[1],
      };
    }
  }

  return DEFAULTS;
}

export default function handler(req) {
  const url = new URL(req.url, SITE);
  const meta = getMetaForPath(url.pathname);

  const html = indexHtml
    .replace(/__OG_TITLE__/g, meta.title)
    .replace(/__OG_DESCRIPTION__/g, meta.description)
    .replace(/__OG_IMAGE__/g, meta.image)
    .replace(/__OG_URL__/g, meta.url);

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
`;
}

export function metadataPlugin(): Plugin {
  return {
    name: 'vite-plugin-metadata',
    configureServer(server) {
      server.middlewares.use('/metadata.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(getMetadata()));
      });
    },
    generateBundle() {
      const json = JSON.stringify(getMetadata());
      this.emitFile({
        type: 'asset',
        fileName: 'metadata.json',
        source: json,
      });
    },
    closeBundle() {
      const distHtml = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'), 'utf-8');
      const metadata = getMetadata();
      const ssrCode = generateSsr(distHtml, metadata);
      fs.writeFileSync(path.resolve(__dirname, 'api', 'ssr.js'), ssrCode);
    },
  };
}

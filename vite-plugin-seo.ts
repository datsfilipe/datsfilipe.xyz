import type { Plugin } from 'vite';
import { posts } from './src/app/data/posts';
import { projects } from './src/app/data/projects';

const SITE = 'https://datsfilipe.xyz';

function generateSitemap(): string {
  const today = new Date().toISOString().split('T')[0];
  const urls: string[] = ['/', '/blog', '/projects', '/rices'];

  for (const post of posts) {
    urls.push(`/blog/${post.id}`);
  }

  for (const project of projects) {
    urls.push(`/projects/${project.id}`);
  }

  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function generateRobots(): string {
  return `User-agent: *
Allow: /
Allow: /api/og/*

Sitemap: ${SITE}/sitemap.xml
`;
}

export function seoPlugin(): Plugin {
  return {
    name: 'vite-plugin-seo',
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml');
        res.end(generateSitemap());
      });
      server.middlewares.use('/robots.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain');
        res.end(generateRobots());
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: generateSitemap(),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: generateRobots(),
      });
    },
  };
}

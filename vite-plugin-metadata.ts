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
  };
}

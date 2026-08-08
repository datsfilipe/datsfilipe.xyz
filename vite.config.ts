import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { renameSync } from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { metadataPlugin } from './vite-plugin-metadata';
import { rssPlugin } from './vite-plugin-rss';
import { seoPlugin } from './vite-plugin-seo';

function ssrTemplatePlugin(): Plugin {
  return {
    name: 'ssr-template',
    apply: 'build',
    writeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      renameSync(path.join(dist, 'index.html'), path.join(dist, '_ssr.html'));
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    rssPlugin(),
    seoPlugin(),
    metadataPlugin(),
    ssrTemplatePlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

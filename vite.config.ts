import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { metadataPlugin } from './vite-plugin-metadata';
import { rssPlugin } from './vite-plugin-rss';
import { seoPlugin } from './vite-plugin-seo';

export default defineConfig({
  plugins: [react(), tailwindcss(), rssPlugin(), seoPlugin(), metadataPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

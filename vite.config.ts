import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { ogPlugin } from './vite-plugin-og';
import { rssPlugin } from './vite-plugin-rss';
import { seoPlugin } from './vite-plugin-seo';

export default defineConfig({
  plugins: [react(), tailwindcss(), rssPlugin(), ogPlugin(), seoPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

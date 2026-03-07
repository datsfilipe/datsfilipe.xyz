import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { rssPlugin } from "./vite-plugin-rss";
import { ogPlugin } from "./vite-plugin-og";
import { seoPlugin } from "./vite-plugin-seo";

export default defineConfig({
  plugins: [react(), tailwindcss(), rssPlugin(), ogPlugin(), seoPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

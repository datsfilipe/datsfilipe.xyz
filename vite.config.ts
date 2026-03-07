import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { rssPlugin } from "./vite-plugin-rss";

export default defineConfig({
  plugins: [react(), tailwindcss(), rssPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

import type { Plugin } from "vite";
import { posts } from "./src/app/data/posts";
import { projects } from "./src/app/data/projects";

const SITE = "https://datsfilipe.xyz";

function generateSitemap(): string {
  const urls: { loc: string; priority: string }[] = [
    { loc: "/", priority: "1.0" },
    { loc: "/blog", priority: "0.8" },
    { loc: "/projects", priority: "0.8" },
    { loc: "/rices", priority: "0.7" },
  ];

  for (const post of posts) {
    urls.push({ loc: `/blog/${post.id}`, priority: "0.6" });
  }

  for (const project of projects) {
    urls.push({ loc: `/projects/${project.id}`, priority: "0.6" });
  }

  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function generateRobots(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
}

export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo",
    configureServer(server) {
      server.middlewares.use("/sitemap.xml", (_req, res) => {
        res.setHeader("Content-Type", "application/xml");
        res.end(generateSitemap());
      });
      server.middlewares.use("/robots.txt", (_req, res) => {
        res.setHeader("Content-Type", "text/plain");
        res.end(generateRobots());
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: generateSitemap(),
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: generateRobots(),
      });
    },
  };
}

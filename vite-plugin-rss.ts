import type { Plugin } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";
import { posts } from "./src/app/data/posts";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/);
  return match ? match[1] : content;
}

function generateRssXml(): string {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sortedPosts.map((post) => {
    let body = "";
    try {
      const raw = readFileSync(
        resolve(__dirname, "public/blog", post.file),
        "utf-8",
      );
      body = stripFrontmatter(raw);
    } catch {
      body = "";
    }

    const description =
      body.slice(0, 200).replace(/\n/g, " ").trim() + "...";

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://datsfilipe.xyz/blog/${post.id}</link>
      <description>${escapeXml(description)}</description>
      <content:encoded><![CDATA[${body}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">https://datsfilipe.xyz/blog/${post.id}</guid>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>datsfilipe's blog</title>
    <link>https://datsfilipe.xyz/blog</link>
    <description>Thoughts and articles about programming, linux and other things</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://datsfilipe.xyz/rss.xml" rel="self" type="application/rss+xml" />${items.join("")}
  </channel>
</rss>`;
}

export function rssPlugin(): Plugin {
  return {
    name: "vite-plugin-rss",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "rss.xml",
        source: generateRssXml(),
      });
    },
    configureServer(server) {
      server.middlewares.use("/rss.xml", (_req, res) => {
        res.setHeader("Content-Type", "application/xml");
        res.end(generateRssXml());
      });
    },
  };
}

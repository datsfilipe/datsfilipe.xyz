import { readFile } from 'fs/promises';
import { marked } from 'marked';
import { getAllBlogPosts, type BlogPost } from './blog';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  category: string;
}

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter: Record<string, string> = {};
  frontmatterText.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function generateRSS(): Promise<string> {
  const posts = await getAllBlogPosts();
  const items: RSSItem[] = [];

  for (const post of posts) {
    try {
      const filePath = `public${post.path}.md`;
      const content = await readFile(filePath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);

      const description = body.slice(0, 200).replace(/\n/g, ' ').trim() + '...';
      const htmlContent = await marked(body);
      const pubDate = frontmatter.date
        ? new Date(frontmatter.date).toUTCString()
        : new Date().toUTCString();

      items.push({
        title: frontmatter.title || post.title,
        link: `https://datsfilipe.xyz${post.path}`,
        description: escapeXml(description),
        content: htmlContent,
        pubDate,
        category: post.category,
      });
    } catch (error) {
      console.warn(`failed to read post for RSS: ${post.path}`, error);
    }
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>datsfilipe's blog</title>
    <link>https://datsfilipe.xyz/blog</link>
    <description>Thoughts and articles about programming, linux and other things</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://datsfilipe.xyz/rss" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <content:encoded><![CDATA[${item.content}]]></content:encoded>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return rss;
}

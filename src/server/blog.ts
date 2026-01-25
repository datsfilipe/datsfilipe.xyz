import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export interface BlogPost {
  title: string;
  path: string;
  category: string;
}

function parseFrontmatter(content: string): { tags?: string } {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);

  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const tagsMatch = frontmatter.match(/tags:\s*(.+)/);

  if (tagsMatch) {
    return { tags: tagsMatch[1].trim() };
  }

  return {};
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  async function scan(dir: string, category: string = 'General') {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name.toLowerCase() === 'readme.md') {
          continue;
        }

        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          await scan(fullPath, entry.name);
        } else if (entry.name.endsWith('.md')) {
          const title = entry.name
            .replace(/\.md$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          let postCategory = category || 'general';

          try {
            const content = await readFile(fullPath, 'utf-8');
            const frontmatter = parseFrontmatter(content);

            if (frontmatter.tags) {
              const firstTag = frontmatter.tags.split(',')[0].trim();
              postCategory = firstTag;
            }
          } catch (error) {
            console.warn(`failed to parse frontmatter for ${fullPath}:`, error);
          }

          posts.push({
            title,
            path: fullPath.replace('public', '').replace(/\.md$/, ''),
            category: postCategory,
          });
        }
      }
    } catch (error) {
      console.warn(`scan failed: ${dir}:`, error);
    }
  }

  await scan('public/blog');

  return posts;
}

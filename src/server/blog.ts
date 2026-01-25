import { readdir } from 'fs/promises';
import { join } from 'path';

export interface BlogPost {
  title: string;
  path: string;
  category: string;
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

          posts.push({
            title,
            path: fullPath.replace('public', '').replace(/\.md$/, ''),
            category: category || 'general',
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

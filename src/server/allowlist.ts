import { readdir } from 'fs/promises';
import { join } from 'path';

export async function generateIgnorePatterns(dir: string): Promise<string[]> {
  const ignorePatterns: string[] = [];

  const allowedExtensions = new Set([
    '.html',
    '.css',
    '.js',
    '.json',
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
  ]);

  const allowedDirs = new Set(['_app', 'notes', 'rices', 'blog']);

  async function scan(fullPath: string, relativePath: string = '') {
    const entries = await readdir(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryRelPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) {
          ignorePatterns.push(`${entryRelPath}/**`);
        } else if (!allowedDirs.has(entry.name)) {
          ignorePatterns.push(`${entryRelPath}/**`);
        } else {
          await scan(join(fullPath, entry.name), entryRelPath);
        }
      } else {
        if (entry.name.startsWith('.')) {
          ignorePatterns.push(entryRelPath);
        } else {
          const ext = entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase();

          if (!allowedExtensions.has(ext)) {
            ignorePatterns.push(entryRelPath);
          }
        }
      }
    }
  }

  await scan(dir);

  return ignorePatterns;
}

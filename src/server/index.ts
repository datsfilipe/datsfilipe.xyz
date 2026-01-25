import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { generateIgnorePatterns } from './allowlist';
import { getAllNotes } from './notes';
import { getAllBlogPosts } from './blog';
import { getProjects } from './projects';
import chokidar from 'chokidar';

const isDev = process.env.NODE_ENV === 'development';

const dynamicIgnorePatterns = await generateIgnorePatterns('public');

const serverStartTime = Date.now();

async function resolveAssets() {
  const glob = new Bun.Glob('public/_app/*');
  const files = await Array.fromAsync(glob.scan());

  const find = (prefix: string, ext: string) => {
    const hashed = files.find((f) => f.includes(`${prefix}.`) && f.endsWith(`.${ext}`) && f !== `public/_app/${prefix}.${ext}`);
    const plain = files.find((f) => f === `public/_app/${prefix}.${ext}`);
    return (hashed || plain)?.replace('public', '') || `/_app/${prefix}.${ext}`;
  };

  return {
    homeScript: find('home', 'js'),
    homeStyle: find('home', 'css'),
    viewerScript: find('viewer', 'js'),
    viewerStyle: find('viewer', 'css'),
  };
}

let assets = await resolveAssets();

const darkModeScript = `<script>(function(){var t=localStorage.getItem('theme'),d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')})()</script>`;

export const app = new Elysia()
  .ws('/live-reload', {
    open(ws) {
      ws.subscribe('live-reload');
      if (isDev) {
        const timeSinceStart = Date.now() - serverStartTime;
        if (timeSinceStart < 2000) {
          setTimeout(() => {
            ws.send('refresh');
          }, 100);
        }
      }
    },
    close(_ws) {},
  })

  .get('/', async ({ set }) => {
    const resumeUrl = process.env.RESUME_URL || '';

    set.headers['Content-Type'] = 'text/html; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${darkModeScript}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>datsfilipe.xyz</title>
    <link rel="stylesheet" href="${assets.homeStyle}">
    <link rel="prefetch" href="${assets.viewerStyle}" as="style">
    <link rel="prefetch" href="${assets.viewerScript}" as="script">
    <script>window.__RESUME_URL__ = ${JSON.stringify(resumeUrl)};</script>
  </head>
  <body>
    <div id="elysia"></div>
    <script type="module" src="${assets.homeScript}"></script>
  </body>
</html>`;
  })

  .get('/api/notes', async () => {
    const notes = await getAllNotes();
    return { notes };
  })

  .get('/api/projects', async () => {
    const projects = await getProjects();
    return { projects };
  })

  .get('/api/blog', async () => {
    const posts = await getAllBlogPosts();
    return { posts };
  })

  .get('/api/rices', async () => {
    const file = Bun.file('public/rices/metadata.json');
    if (await file.exists()) {
      return await file.json();
    }
    return [];
  })

  .get('/notes', async ({ set }) => {
    set.headers['Content-Type'] = 'text/html; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${darkModeScript}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes Browser</title>
    <link rel="stylesheet" href="${assets.viewerStyle}">
  </head>
  <body>
    <div id="viewer"></div>
    <script type="module" src="${assets.viewerScript}"></script>
  </body>
</html>`;
  })

  .get('/blog', async ({ set }) => {
    set.headers['Content-Type'] = 'text/html; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${darkModeScript}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog</title>
    <link rel="stylesheet" href="${assets.viewerStyle}">
  </head>
  <body>
    <div id="viewer"></div>
    <script type="module" src="${assets.viewerScript}"></script>
  </body>
</html>`;
  })

  .get('/blog/*', async ({ path, request, set }) => {
    const pathLower = path.toLowerCase();
    if (
      pathLower.includes('/.git') ||
      pathLower.includes('/.env') ||
      pathLower.includes('/node_modules') ||
      path.includes('..')
    ) {
      set.status = 403;
      return '403 Forbidden';
    }

    const assetPath = `public${path}`;
    const assetFile = Bun.file(assetPath);

    if (await assetFile.exists()) {
      const ext = path.split('.').pop()?.toLowerCase();
      const accept = request.headers.get('accept') || '';

      if (ext === 'md' && !accept.includes('text/html')) {
        set.headers['Content-Type'] = 'text/markdown; charset=utf-8';
        return assetFile;
      }

      const assetContentTypes: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        webp: 'image/webp',
      };
      if (ext && assetContentTypes[ext]) {
        set.headers['Content-Type'] = assetContentTypes[ext];
        return assetFile;
      }
    }

    set.headers['Content-Type'] = 'text/html; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${darkModeScript}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post</title>
    <link rel="stylesheet" href="${assets.viewerStyle}">
  </head>
  <body>
    <div id="viewer"></div>
    <script type="module" src="${assets.viewerScript}"></script>
  </body>
</html>`;
  })

  .get('/notes/*', async ({ path, request, set }) => {
    const pathLower = path.toLowerCase();
    if (
      pathLower.includes('/.git') ||
      pathLower.includes('/.env') ||
      pathLower.includes('/node_modules') ||
      path.includes('..')
    ) {
      set.status = 403;
      return '403 Forbidden';
    }

    const assetPath = `public${path}`;
    const assetFile = Bun.file(assetPath);

    if (await assetFile.exists()) {
      const ext = path.split('.').pop()?.toLowerCase();
      const accept = request.headers.get('accept') || '';

      if (ext === 'md' && !accept.includes('text/html')) {
        set.headers['Content-Type'] = 'text/markdown; charset=utf-8';
        return assetFile;
      }

      const assetContentTypes: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        webp: 'image/webp',
      };
      if (ext && assetContentTypes[ext]) {
        set.headers['Content-Type'] = assetContentTypes[ext];
        return assetFile;
      }
    }

    set.headers['Content-Type'] = 'text/html; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${darkModeScript}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes Viewer</title>
    <link rel="stylesheet" href="${assets.viewerStyle}">
  </head>
  <body>
    <div id="viewer"></div>
    <script type="module" src="${assets.viewerScript}"></script>
  </body>
</html>`;
  })

  .use(
    await staticPlugin({
      assets: 'public',
      prefix: '/',
      ignorePatterns: dynamicIgnorePatterns,
    }),
  )
  .get('/message', { message: 'Hello from server' } as const)
  .listen(3000);

console.log(`server running at ${app.server?.hostname}:${app.server?.port}`);

if (isDev) {
  const watcher = chokidar.watch('public/_app', {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    }
  });

  watcher.on('change', async (path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      assets = await resolveAssets();
      console.log(`reloading: ${path}`);
      app.server?.publish('live-reload', 'refresh');
    }
  });

  watcher.on('error', (error) => console.error(`watch error: ${error}`));
}

import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { generateIgnorePatterns } from './allowlist';
import { getAllNotes } from './notes';
import chokidar from 'chokidar';

const isDev = process.env.NODE_ENV === 'development';

const dynamicIgnorePatterns = await generateIgnorePatterns('public');

const serverStartTime = Date.now();

export const app = new Elysia()
  .ws('/live-reload', {
    open(ws) {
      ws.subscribe('live-reload');
      if (isDev) {
        console.log('live reload connected');

        const timeSinceStart = Date.now() - serverStartTime;
        if (timeSinceStart < 2000) {
          setTimeout(() => {
            ws.send('refresh');
          }, 100);
        }
      }
    },
    close(_ws) {
      if (isDev) {
        console.log('live reload disconnected');
      }
    },
  })

  .get('/', async ({ set }) => {
    const jsGlob = new Bun.Glob('public/_app/home.*.js');
    const cssGlob = new Bun.Glob('public/_app/home.*.css');

    const homeScripts = await Array.fromAsync(jsGlob.scan());
    const homeStyles = await Array.fromAsync(cssGlob.scan());

    const homeScript = homeScripts[0]?.replace('public', '') || '/_app/home.js';
    const homeStyle = homeStyles[0]?.replace('public', '') || '/_app/home.css';

    set.headers['Content-Type'] = 'text/html; charset=utf-8';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>datsfilipe.xyz</title>
    <link rel="stylesheet" href="${homeStyle}">
  </head>
  <body>
    <div id="elysia"></div>
    <script type="module" src="${homeScript}"></script>
  </body>
</html>`;
  })

  .get('/api/notes', async () => {
    const notes = await getAllNotes();
    return { notes };
  })

  .get('/notes', async ({ set }) => {
    const jsGlob = new Bun.Glob('public/_app/viewer.*.js');
    const cssGlob = new Bun.Glob('public/_app/viewer.*.css');

    const viewerScripts = await Array.fromAsync(jsGlob.scan());
    const viewerStyles = await Array.fromAsync(cssGlob.scan());

    const viewerScript = viewerScripts[0]?.replace('public', '') || '/_app/viewer.js';
    const viewerStyle = viewerStyles[0]?.replace('public', '') || '/_app/viewer.css';

    set.headers['Content-Type'] = 'text/html; charset=utf-8';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes Browser</title>
    <link rel="stylesheet" href="${viewerStyle}">
  </head>
  <body>
    <div id="viewer"></div>
    <script type="module" src="${viewerScript}"></script>
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

    const jsGlob = new Bun.Glob('public/_app/viewer.*.js');
    const cssGlob = new Bun.Glob('public/_app/viewer.*.css');

    const viewerScripts = await Array.fromAsync(jsGlob.scan());
    const viewerStyles = await Array.fromAsync(cssGlob.scan());

    const viewerScript = viewerScripts[0]?.replace('public', '') || '/_app/viewer.js';
    const viewerStyle = viewerStyles[0]?.replace('public', '') || '/_app/viewer.css';

    set.headers['Content-Type'] = 'text/html; charset=utf-8';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes Viewer</title>
    <link rel="stylesheet" href="${viewerStyle}">
  </head>
  <body>
    <div id="viewer"></div>
    <script type="module" src="${viewerScript}"></script>
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

console.log(`🦊 elysia is running at ${app.server?.hostname}:${app.server?.port}`);

if (isDev) {
  console.log('watching _app for changes...');

  const watcher = chokidar.watch('public/_app', {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    }
  });

  watcher.on('change', (path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      console.log(`change detected: ${path}, sending refresh...`);
      app.server?.publish('live-reload', 'refresh');
    }
  });

  watcher.on('error', (error) => console.error('watcher error:', error));
}

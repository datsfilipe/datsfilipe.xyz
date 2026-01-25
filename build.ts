import tailwind from 'bun-plugin-tailwind';

const entries = ['./src/client/index.tsx', './src/client/viewer.tsx'];
const isDev = process.argv.includes('--dev');
const isWatch = process.argv.includes('--watch');

if (isWatch) {
  await Promise.all(
    entries.map((entry) => {
      const name = entry.includes('index') ? 'home' : 'viewer';
      return Bun.build({
        entrypoints: [entry],
        outdir: './public/_app',
        naming: isDev ? `${name}.[ext]` : `${name}.[hash].[ext]`,
        minify: !isDev,
        plugins: [tailwind],
        watch: true,
      });
    })
  );
  console.log(`✓ Watching ${entries.length} entry points`);
  await new Promise(() => {});
} else {
  for (const entry of entries) {
    const name = entry.includes('index') ? 'home' : 'viewer';
    await Bun.build({
      entrypoints: [entry],
      outdir: './public/_app',
      naming: isDev ? `${name}.[ext]` : `${name}.[hash].[ext]`,
      minify: !isDev,
      plugins: [tailwind],
    });
  }
  console.log(`✓ Built ${entries.length} entry points`);
}

# datsfilipe.xyz

Minimal personal website built with Bun, Elysia, React, and TailwindCSS.

## Development

```bash
bun install
bun run dev
```

Open http://localhost:3000/ to view the site.

## Build

```bash
bun run build        # Build both client and server
bun run build:client # Build client only
bun run build:server # Build server only
```

## Environment Variables

```
RESUME_URL=https://example.com/resume.pdf
```

## Architecture

- Server: Elysia (Bun runtime)
- Client: React with TailwindCSS v4
- Content: Markdown-based notes and blog
- Assets: Git LFS for images

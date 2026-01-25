import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import '@client/styles/global.css';
import 'highlight.js/styles/github-dark.css';
import { setupLiveReload } from '@client/libs/live-reload';
import { DarkModeToggle } from '@client/components/dark-mode-toggle';

interface Note {
  content: string;
  path: string;
  title: string;
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

function NoteViewer() {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      const { frontmatter } = parseFrontmatter(note.content);
      document.title = frontmatter.title || note.title;
    }
  }, [note]);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        setError(null);

        const path = window.location.pathname;
        const isBlogPath = path.startsWith('/blog');
        const isNotesPath = path.startsWith('/notes');

        if (!isBlogPath && !isNotesPath) {
          throw new Error('invalid path');
        }

        const markdownUrl = `${path}.md`;
        const response = await fetch(markdownUrl);
        if (!response.ok) {
          throw new Error(`${isBlogPath ? 'post' : 'note'} not found: ${path}`);
        }

        const content = await response.text();

        const pathParts = path.split('/').filter(Boolean);
        const fileName = pathParts[pathParts.length - 1] || 'Note';
        const title =
          fileName
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') || 'Note';

        setNote({
          content,
          path,
          title,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'failed to load content');
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center">
        <div className="text-center font-mono">loading...</div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">404</div>
          <div className="font-mono">{error || 'something went wrong'}</div>
          <a href="/" className="mt-4 inline-block font-mono hover:underline">
            ← back home
          </a>
        </div>
      </div>
    );
  }

  const { frontmatter, body } = parseFrontmatter(note.content);
  const displayTitle = frontmatter.title || note.title;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <DarkModeToggle />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <a href="/" className="font-mono hover:underline">
            ← back home
          </a>
        </div>
        <article className="border border-fg p-8">
          {displayTitle && <h1 className="text-4xl font-bold mb-8">{displayTitle}</h1>}

          {frontmatter.cover_image && (
            <div className="mb-8 border border-fg">
              <img
                src={frontmatter.cover_image}
                alt={displayTitle || 'Cover image'}
                className="w-full"
                loading="lazy"
              />
            </div>
          )}

          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeHighlight,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              ]}
            >
              {body}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('viewer')!);
root.render(<NoteViewer />);

setupLiveReload();

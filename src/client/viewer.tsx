import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import clsx from 'clsx';

import '@client/styles/global.css';
import 'highlight.js/styles/github-dark.css';
import { setupLiveReload } from '@client/libs/live-reload';

const queryClient = new QueryClient();

interface Note {
  content: string;
  path: string;
  title: string;
}

interface NoteListItem {
  path: string;
  title: string;
  category: string;
}

function NoteViewer() {
  const [note, setNote] = useState<Note | null>(null);
  const [notesList, setNotesList] = useState<NoteListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrowsing, setIsBrowsing] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        setError(null);

        const path = window.location.pathname;

        if (!path.startsWith('/notes')) {
          throw new Error('invalid path');
        }

        if (path === '/notes' || path === '/notes/') {
          setIsBrowsing(true);

          const response = await fetch('/api/notes');
          if (!response.ok) throw new Error('failed to load list');

          const data = await response.json();
          setNotesList(data.notes);

          return;
        }

        setIsBrowsing(false);

        const markdownUrl = `${path}.md`;
        const response = await fetch(markdownUrl);
        if (!response.ok) {
          throw new Error(`note not found: ${path}`);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-xl text-gray-600">loading...</div>
        </div>
      </div>
    );
  }

  if (error || (!note && !notesList)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">!</div>
          <div className="text-2xl font-bold mb-2">
            {isBrowsing ? 'failed to load notes' : '404'}
          </div>
          <div className="text-gray-600">{error || 'something went wrong'}</div>
          <a href="/" className="mt-4 inline-block text-blue-500 hover:underline">
            {'<-'}
          </a>
        </div>
      </div>
    );
  }

  if (isBrowsing && notesList) {
    const categorizedNotes = notesList.reduce(
      (acc, note) => {
        if (!acc[note.category]) {
          acc[note.category] = [];
        }
        acc[note.category].push(note);
        return acc;
      },
      {} as Record<string, NoteListItem[]>,
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
                {'<-'}
              </a>
              <h1 className="text-2xl font-bold text-gray-900">browse</h1>
              <div className="w-16" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            {Object.entries(categorizedNotes).map(([category, notes]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {notes.map((note) => (
                    <a
                      key={note.path}
                      href={note.path}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="font-medium text-gray-900">{note.title}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <a href="/notes" className="text-sm text-gray-600 hover:text-gray-900">
              {'<-'}
            </a>
            <h1 className="text-xl font-bold text-gray-900">{note?.title}</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article
          className={clsx(
            'prose prose-lg prose-gray',
            'prose-headings:font-bold',
            'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
            'prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
            'prose-pre:bg-gray-900 prose-pre:text-gray-100',
            'prose-img:rounded-lg prose-img:shadow-md',
            'max-w-none',
            'bg-white p-8 rounded-lg shadow-sm',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ]}
          >
            {note?.content || ''}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NoteViewer />
    </QueryClientProvider>
  );
}

const root = createRoot(document.getElementById('viewer')!);
root.render(<App />);

setupLiveReload();

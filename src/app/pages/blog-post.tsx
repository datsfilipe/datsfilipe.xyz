import { useEffect, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router';
import { MarkdownContent } from '../components/markdown-content';
import { posts } from '../data/posts';
import { useMeta } from '../hooks/use-meta';

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/);
  return match ? match[1] : content;
}

export function BlogPost() {
  const { postId } = useParams<{ postId: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const post = posts.find((p) => p.id === postId);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!post) return;
    fetch(`/blog/${post.file}`)
      .then((res) => res.text())
      .then((text) => setContent(stripFrontmatter(text)))
      .catch(() => setContent('Failed to load post content.'));
  }, [post]);

  useMeta({
    title: post?.title ?? 'Post not found',
    ogImage: post ? `/og/blog/${post.id}.png` : undefined,
    url: post ? `/blog/${post.id}` : undefined,
  });

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const backTo = from === 'home' ? '/' : '/blog';
  const backLabel = from === 'home' ? 'Back to home' : 'Back to blog';

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-8"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {backLabel}
      </Link>

      <article>
        <div className="mb-8">
          <h1 className="font-['IBM_Plex_Mono'] text-3xl md:text-4xl mb-2">{post.title}</h1>
          <time className="text-sm text-[var(--muted)]">{post.date}</time>
        </div>

        {post.cover && (
          <div className="mb-8 overflow-hidden border border-[var(--border)]">
            <img src={post.cover} alt={post.title} className="w-full" />
          </div>
        )}

        {content === null ? (
          <p className="text-[var(--muted)]">Loading...</p>
        ) : (
          <MarkdownContent content={content} title={post.title} />
        )}
      </article>
    </div>
  );
}

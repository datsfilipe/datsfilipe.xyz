import { Link } from 'react-router';
import { posts } from '../data/posts';
import { useMeta } from '../hooks/use-meta';

export function Blog() {
  useMeta({
    title: 'Blog',
    description: 'Articles about programming, Linux, and other things.',
    ogImage: '/og-image.png',
    url: '/blog',
  });

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <h1 className="font-['IBM_Plex_Mono'] text-3xl md:text-4xl mb-8">Blog</h1>

      <div className="full-bleed-lines">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="block py-4 hover:bg-[var(--hover-bg)] transition-colors notebook-line"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-4">
              <h2 className="text-lg flex-1">{post.title}</h2>
              <span className="text-sm text-[var(--muted)] md:whitespace-nowrap">{post.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

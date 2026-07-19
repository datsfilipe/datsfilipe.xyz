import { Link } from 'react-router';
import { posts } from '../data/posts';
import { useMeta } from '../hooks/use-meta';

export function Blog() {
  useMeta('Blog');

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <h1 className="font-['IBM_Plex_Mono'] text-3xl md:text-4xl mb-8">Blog</h1>

      <div className="full-bleed-lines">
        {posts.map((post) => {
          const content = (
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 md:gap-4">
              <div className="flex-1">
                <h2 className="text-lg">{post.title}</h2>
                {post.source && <p className="text-sm text-[var(--muted)]">{post.source}</p>}
              </div>
              <span className="text-sm text-[var(--muted)] md:whitespace-nowrap">{post.date}</span>
            </div>
          );
          const className = 'block py-4 hover:bg-[var(--hover-bg)] transition-colors notebook-line';
          return post.external ? (
            <a
              key={post.id}
              href={post.external}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          ) : (
            <Link key={post.id} to={`/blog/${post.id}`} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

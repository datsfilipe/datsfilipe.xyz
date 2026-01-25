import { useState, useEffect } from 'react';

interface BlogPost {
  title: string;
  path: string;
  category: string;
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('fetch blog posts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="blog" className="w-full max-w-4xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-7xl font-bold mb-4">Blog</h2>
        <p className="font-mono text-sm opacity-60">thoughts & articles</p>
      </div>

      <div className="border border-fg">
        {loading ? (
          <div className="p-8 text-center font-mono">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center font-mono opacity-60">
            No articles yet
          </div>
        ) : (
          <div>
            {posts.map((post, idx) => (
              <a
                key={post.path}
                href={post.path}
                className={`block p-6 hover:bg-fg hover:text-bg transition-colors ${
                  idx !== posts.length - 1 ? 'border-b border-fg' : ''
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <span className="text-sm font-mono opacity-60">{post.category}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

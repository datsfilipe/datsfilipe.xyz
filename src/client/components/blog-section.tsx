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
    <section id="blog" className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-3">Blog</h2>
        <p className="font-mono text-sm text-muted">thoughts & articles</p>
      </div>

      {loading ? (
        <div className="text-center py-8 font-mono text-sm text-muted">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="card-bordered p-12 text-center font-mono text-muted">
          No articles yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <a
              key={post.path}
              href={post.path}
              className="card-interactive p-6 group"
            >
              <span className="font-mono text-xs uppercase block mb-3 opacity-40 group-hover:opacity-60">{post.category}</span>
              <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">{post.title}</h3>
              <span className="font-mono text-xs opacity-60 group-hover:opacity-80">Read more →</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

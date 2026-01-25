import { useState, useEffect } from 'react';

interface Rice {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  fullImage?: string;
}

export function RicesGallery() {
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rices')
      .then(res => res.json())
      .then(data => {
        setRices(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('fetch rices:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="rices" className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-3">Rices</h2>
        <p className="font-mono text-sm text-muted">unix desktop customization</p>
      </div>

      {loading ? (
        <div className="text-center py-8 font-mono text-sm text-muted">Loading rices...</div>
      ) : rices.length === 0 ? (
        <div className="card-bordered p-12 text-center">
          <p className="font-mono text-sm text-muted">No rices yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rices.map((rice, idx) => (
            <a
              key={rice.id}
              href={rice.fullImage ? `/rices/${rice.fullImage}` : `/rices/${rice.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-bordered overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              title="Click to view full resolution image"
            >
              <div className="aspect-video bg-surface-1 flex items-center justify-center overflow-hidden relative">
                <img
                  src={`/rices/${rice.file}`}
                  alt={rice.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.parentElement!.innerHTML = `<span class="font-mono text-xs text-subtle">[${String(idx + 1).padStart(2, '0')}]</span>`;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1 group-hover:translate-x-1 transition-transform">{rice.title}</h3>
                <p className="text-sm font-mono text-muted">{rice.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

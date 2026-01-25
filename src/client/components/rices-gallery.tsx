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

  if (loading) {
    return <div className="text-center py-8">Loading rices...</div>;
  }

  return (
    <section id="rices" className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-7xl font-bold mb-4">Rices</h2>
        <p className="font-mono text-sm opacity-60">unix desktop customization</p>
      </div>

      {rices.length === 0 ? (
        <div className="border border-fg p-12 text-center">
          <p className="font-mono text-sm opacity-60">
            TODO: Export Figma screenshots → public/rices/
          </p>
          <pre className="font-mono text-xs opacity-40 mt-4">
{`ffmpeg -i input.png -vf scale=1920:-1 -q:v 2 output.jpg`}
          </pre>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rices.map((rice) => (
            <div key={rice.id} className="border border-fg group">
              <a
                href={rice.fullImage ? `/rices/${rice.fullImage}` : `/rices/${rice.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                title="Click to view full resolution image"
              >
                <div className="aspect-video bg-fg bg-opacity-5 flex items-center justify-center border-b border-fg overflow-hidden">
                  <img
                    src={`/rices/${rice.file}`}
                    alt={rice.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.parentElement!.innerHTML = '<span class="font-mono text-xs opacity-40">image not found</span>';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{rice.title}</h3>
                  <p className="text-sm font-mono opacity-60">{rice.subtitle}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

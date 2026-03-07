import { useEffect, useState } from 'react';
import { useMeta } from '../hooks/use-meta';

interface Rice {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  fullImage?: string;
}

export function Rices() {
  useMeta({
    title: 'Rices',
    description: 'Linux desktop customization gallery.',
    ogImage: '/og-image.png',
    url: '/rices',
  });

  const [rices, setRices] = useState<Rice[]>([]);

  useEffect(() => {
    fetch('/rices/metadata.json')
      .then((res) => res.json())
      .then((data) => setRices(data))
      .catch(() => setRices([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-12">
        <h1 className="font-['IBM_Plex_Mono'] text-3xl md:text-4xl mb-3">Rices</h1>
        <p className="font-mono text-sm text-[var(--muted)] mb-2">Unix desktop customization</p>
        <p className="mt-2">
          I collect and showcase Unix desktop setups I've built over the years. I used to post many
          of them to r/unixporn on Reddit, but after deleting my account they're now only available
          here.
        </p>
      </div>

      {rices.length === 0 ? (
        <div className="border border-[var(--border)] p-12 text-center">
          <p className="font-mono text-sm text-[var(--muted)]">No rices yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-96">
          {rices.map((rice, idx) => (
            <div key={rice.id} className="relative group">
              <a
                href={rice.fullImage ? `/rices/${rice.fullImage}` : `/rices/${rice.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[var(--border)] overflow-hidden block transition-transform duration-300 group-hover:scale-[1.02]"
                title="Click to view full resolution image"
              >
                <div className="aspect-video flex items-center justify-center overflow-hidden relative">
                  <img
                    src={`/rices/${rice.file}`}
                    alt={rice.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.parentElement!.innerHTML = `<span class="font-mono text-xs text-[var(--muted)]">[${String(idx + 1).padStart(2, '0')}]</span>`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1 group-hover:translate-x-1 transition-transform">
                    {rice.title}
                  </h3>
                  <p className="text-sm font-mono text-[var(--muted)]">{rice.subtitle}</p>
                </div>
              </a>

              <div
                className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 border border-[var(--border)] overflow-hidden bg-[var(--background)]"
                style={{
                  left: '-8px',
                  top: '-8px',
                  width: 'calc(100% + 16px)',
                }}
              >
                <img
                  src={`/rices/${rice.file}`}
                  alt={rice.title}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-1">{rice.title}</h3>
                  <p className="text-sm font-mono text-[var(--muted)]">{rice.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

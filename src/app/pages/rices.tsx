import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { CheckIcon, CopyIcon } from '../components/icons';
import { useMeta } from '../hooks/use-meta';

interface Rice {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  fullImage?: string;
}

export function Rices() {
  useMeta('Rices');

  const [rices, setRices] = useState<Rice[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const activeFromUrl = searchParams.get('rice');

  useEffect(() => {
    fetch('/rices/metadata.json')
      .then((res) => res.json())
      .then((data) => setRices(data))
      .catch(() => setRices([]));
  }, []);

  // Bring the shared rice into view when arriving via a /rices?rice=<id> link.
  useEffect(() => {
    if (!activeFromUrl || rices.length === 0) return;
    document
      .getElementById(`rice-${activeFromUrl}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeFromUrl, rices]);

  // Hover wins while the pointer is over a card; otherwise the URL link decides.
  const openId = hoveredId ?? activeFromUrl;

  async function shareRice(rice: Rice) {
    const url = `${window.location.origin}/rices?rice=${rice.id}`;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (coarse && navigator.share) {
      try {
        await navigator.share({ title: `${rice.title} — datsfilipe`, url });
        return;
      } catch {
        // share dismissed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(rice.id);
      setTimeout(() => setCopiedId((c) => (c === rice.id ? null : c)), 1500);
    } catch {
      // clipboard unavailable
    }
  }

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
          {rices.map((rice, idx) => {
            const open = openId === rice.id;
            const copied = copiedId === rice.id;
            const fullHref = rice.fullImage ? `/rices/${rice.fullImage}` : `/rices/${rice.file}`;

            return (
              <div
                key={rice.id}
                id={`rice-${rice.id}`}
                className="relative"
                onMouseEnter={() => setHoveredId(rice.id)}
                onMouseLeave={() => setHoveredId((h) => (h === rice.id ? null : h))}
              >
                {/* Collapsed card — defines the grid cell */}
                <a
                  href={fullHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[var(--border)] overflow-hidden block"
                  title="Click to view full resolution image"
                >
                  <div className="aspect-video flex items-center justify-center overflow-hidden">
                    <img
                      src={`/rices/${rice.file}`}
                      alt={rice.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.parentElement!.innerHTML = `<span class="font-mono text-xs text-[var(--muted)]">[${String(idx + 1).padStart(2, '0')}]</span>`;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{rice.title}</h3>
                    <p className="text-sm font-mono text-[var(--muted)]">{rice.subtitle}</p>
                  </div>
                </a>

                {/* Expanded overlay — pops above siblings, opened by hover or URL */}
                <div
                  className={`absolute z-50 border border-[var(--border)] bg-[var(--background)] transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{ left: '-8px', top: '-8px', width: 'calc(100% + 16px)' }}
                >
                  {/* Share panel — mirrors the description panel, sits above the image.
                      The transparent pb keeps the hover region continuous with the image. */}
                  <button
                    type="button"
                    disabled={copied}
                    onClick={(e) => {
                      e.preventDefault();
                      shareRice(rice);
                    }}
                    className={`absolute left-0 right-0 pb-2 text-left ${
                      copied ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    style={{ bottom: '100%' }}
                    aria-label={`Copy share link for ${rice.title}`}
                  >
                    <span
                      className={`flex items-center justify-between gap-2 border bg-[var(--background)] p-4 font-bold transition-colors ${
                        copied
                          ? 'border-[var(--success)] text-[var(--success)]'
                          : 'border-[var(--border)] hover:text-[var(--accent)]'
                      }`}
                    >
                      {copied ? 'Link copied!' : 'Copy share link'}
                      {copied ? (
                        <CheckIcon className="w-4 h-4 shrink-0" />
                      ) : (
                        <CopyIcon className="w-4 h-4 shrink-0" />
                      )}
                    </span>
                  </button>

                  <a href={fullHref} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={`/rices/${rice.file}`}
                      alt={rice.title}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </a>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{rice.title}</h3>
                    <p className="text-sm font-mono text-[var(--muted)]">{rice.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

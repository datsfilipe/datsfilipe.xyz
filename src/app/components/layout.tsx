import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

const navLinks = [
  { to: '/', label: 'Home', match: (p: string) => p === '/' },
  { to: '/blog', label: 'Blog', match: (p: string) => p.startsWith('/blog') },
  { to: '/projects', label: 'Projects', match: (p: string) => p.startsWith('/projects') },
  { to: '/rices', label: 'Rices', match: (p: string) => p === '/rices' },
];

export function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative">
      <nav className="border-b border-[var(--border-strong)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
          <Link
            to="/"
            className="font-['IBM_Plex_Mono'] font-medium text-lg hover:text-[var(--accent)] transition-colors"
          >
            datsfilipe
          </Link>
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-[var(--accent)] transition-colors ${link.match(location.pathname) ? 'text-[var(--accent)]' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`hover:text-[var(--accent)] transition-colors ${link.match(location.pathname) ? 'text-[var(--accent)]' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border-strong)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex justify-center items-center gap-3 text-sm text-[var(--muted)]">
          <span>&copy; 2026 Filipe Lima</span>
          <span className="text-[var(--border)]">&bull;</span>
          <a href="/rss.xml" className="hover:text-[var(--accent)] transition-colors">
            RSS
          </a>
        </div>
      </footer>
    </div>
  );
}

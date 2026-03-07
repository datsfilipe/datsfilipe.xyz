import { Link, Outlet, useLocation } from 'react-router';

export function Layout() {
  const location = useLocation();

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
          <div className="flex gap-6 md:gap-8">
            <Link
              to="/"
              className={`hover:text-[var(--accent)] transition-colors ${location.pathname === '/' ? 'text-[var(--accent)]' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`hover:text-[var(--accent)] transition-colors ${location.pathname.startsWith('/blog') ? 'text-[var(--accent)]' : ''}`}
            >
              Blog
            </Link>
            <Link
              to="/projects"
              className={`hover:text-[var(--accent)] transition-colors ${location.pathname.startsWith('/projects') ? 'text-[var(--accent)]' : ''}`}
            >
              Projects
            </Link>
            <Link
              to="/rices"
              className={`hover:text-[var(--accent)] transition-colors ${location.pathname === '/rices' ? 'text-[var(--accent)]' : ''}`}
            >
              Rices
            </Link>
          </div>
        </div>
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

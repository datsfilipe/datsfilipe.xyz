import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-24 text-center">
      <h1 className="font-['IBM_Plex_Mono'] text-6xl mb-4">404</h1>
      <p className="text-xl mb-8 text-[var(--muted)]">Page not found</p>
      <Link to="/" className="inline-block text-[var(--accent)] hover:underline">
        Return to home
      </Link>
    </div>
  );
}

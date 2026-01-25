declare global {
  interface Window {
    __RESUME_URL__?: string;
  }
}

export function Hero() {
  const resumeUrl = window.__RESUME_URL__;

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="border border-fg p-12 md:p-20">
          <div className="mb-8">
            <pre className="font-mono text-xs md:text-sm opacity-60">
{`┌─────────────────────────┐
│  fullstack engineer     │
└─────────────────────────┘`}
            </pre>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight">
            datsfilipe
          </h1>

          <div className="border-t border-fg pt-8 flex flex-wrap gap-4 font-mono text-sm">
            <a
              href="#projects"
              className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition-colors"
            >
              [projects]
            </a>
            <a
              href="#notes"
              className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition-colors"
            >
              [notes]
            </a>
            <a
              href="#blog"
              className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition-colors"
            >
              [blog]
            </a>
            <a
              href="#rices"
              className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition-colors"
            >
              [rices]
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition-colors"
                aria-label="View resume (opens in new tab)"
              >
                [resume]
              </a>
            )}
            <a
              href="https://github.com/datsfilipe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition-colors"
            >
              [github]
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

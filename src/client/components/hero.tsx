import { ExternalLink, Mouse } from 'lucide-react';

declare global {
  interface Window {
    __RESUME_URL__?: string;
  }
}

export function Hero() {
  const resumeUrl = window.__RESUME_URL__;

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="max-w-5xl w-full">
        <div className="bg-surface-1 rounded-lg p-12 md:p-16 card-elevated">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-surface-2 rounded-md font-mono text-sm tracking-wider text-muted">
              FULLSTACK ENGINEER
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight transition-all duration-300 hover:tracking-wide">
            datsfilipe
          </h1>

          <p className="font-mono text-sm md:text-base leading-relaxed text-muted max-w-2xl mb-12">
            Building tools and experiences that make developers' lives easier.
            Working with modern web technologies, CLI tools, and the intersection of design and functionality.
          </p>

          <div className="border-t border-subtle pt-8 flex flex-wrap gap-3 font-mono text-sm">
            <a
              href="#projects"
              className="btn btn-outline hover:scale-105 active:scale-95"
            >
              projects
            </a>
            <a
              href="#notes"
              className="btn btn-outline hover:scale-105 active:scale-95"
            >
              notes
            </a>
            <a
              href="#blog"
              className="btn btn-outline hover:scale-105 active:scale-95"
            >
              blog
            </a>
            <a
              href="#rices"
              className="btn btn-outline hover:scale-105 active:scale-95"
            >
              rices
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                aria-label="View resume (opens in new tab)"
              >
                <ExternalLink size={14} />
                resume
              </a>
            )}
            <a
              href="https://github.com/datsfilipe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              github
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce-slow text-fg">
        <Mouse size={32} strokeWidth={1.5} />
      </div>
    </section>
  );
}

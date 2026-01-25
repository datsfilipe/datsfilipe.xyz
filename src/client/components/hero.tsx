import { useState, useEffect } from 'react';
import { ExternalLink, Mouse } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

declare global {
  interface Window {
    __RESUME_URL__?: string;
  }
}

export function Hero() {
  const resumeUrl = window.__RESUME_URL__;
  const [profileContent, setProfileContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github-profile')
      .then(res => res.text())
      .then(content => {
        setProfileContent(content);
        setLoading(false);
      })
      .catch(err => {
        console.error('fetch github profile:', err);
        setProfileContent('23 yo software engineer from Brazil.');
        setLoading(false);
      });
  }, []);


  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="max-w-5xl w-full">
        <div>
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-surface-2 rounded-md font-mono text-xs tracking-wider text-muted">
              Fullstack Software Engineer
            </span>
          </div>

          <div className="font-mono text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="prose prose-sm max-w-none break-words text-xs md:text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    table: () => null,
                    h1: ({ children }) => (
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight !text-fg">
                        {children}
                      </h1>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight !text-fg">
                        {children}
                      </h4>
                    ),
                  }}
                >
                  {profileContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="pt-6 flex flex-wrap gap-3 font-mono text-sm">
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

      <div className="hidden md:block absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce-slow text-muted z-10">
        <Mouse size={32} strokeWidth={1.5} />
      </div>
    </section>
  );
}

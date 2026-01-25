import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@server/projects';

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('fetch projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="projects" className="w-full max-w-6xl mx-auto py-20 px-4">
        <div className="text-center py-8 font-mono text-sm text-muted">Loading projects...</div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  const featured = projects.find(p => p.featured);
  const other = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-3">Projects</h2>
        <p className="font-mono text-sm text-muted">building tools & experiences</p>
      </div>

      {featured && (
        <div className="card-bordered p-8 md:p-10 mb-8 hover:scale-[1.01] transition-all duration-300 group">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="font-mono text-xs text-subtle block mb-2">#001 • FEATURED</span>
              <h3 className="text-3xl md:text-4xl font-bold">{featured.name}</h3>
            </div>
            {featured.stars && (
              <span className="font-mono text-sm px-3 py-1 bg-surface-1 rounded-md">★ {featured.stars}</span>
            )}
          </div>

          <p className="text-base md:text-lg mb-8 leading-relaxed text-muted max-w-3xl">{featured.description}</p>

          {featured.video && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-card">
              <video
                controls
                className="w-full"
                preload="metadata"
              >
                <source src={featured.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {featured.highlights && featured.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {featured.highlights.map((highlight, idx) => (
                <div key={idx} className="bg-surface-1 rounded-md p-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  <p className="font-mono text-xs">{highlight}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 font-mono text-sm pt-6 border-t border-subtle">
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              github
            </a>
            {featured.links?.cargo && (
              <a
                href={featured.links.cargo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                crates.io
              </a>
            )}
            {featured.links?.aur && (
              <a
                href={featured.links.aur}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                aur
              </a>
            )}
            {featured.links?.npm && (
              <a
                href={featured.links.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                npm
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {other.map((project, idx) => {
          const isLast = idx === other.length - 1;
          const isOdd = other.length % 2 !== 0;
          const shouldSpan = isLast && isOdd;
          const projectNum = String(idx + 2).padStart(3, '0');

          return (
            <div
              key={project.id}
              className={`card-bordered p-6 hover:scale-[1.02] transition-all duration-300 group ${shouldSpan ? 'md:col-span-2' : ''}`}
            >
              <span className="font-mono text-xs text-subtle block mb-2">#{projectNum}</span>
              <h3 className="text-xl font-bold mb-3 group-hover:translate-x-1 transition-transform">{project.name}</h3>
              <p className="mb-6 leading-relaxed text-sm text-muted">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <div className="mb-6 space-y-2">
                  {project.highlights.slice(0, 3).map((highlight, hIdx) => (
                    <div key={hIdx} className="font-mono text-xs text-subtle opacity-70 group-hover:opacity-100 transition-opacity">
                      • {highlight}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 font-mono text-xs pt-4 border-t border-subtle">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline text-muted hover:opacity-100 transition-opacity"
                >
                  <ExternalLink size={12} />
                  github
                </a>
                {project.links?.cargo && (
                  <a
                    href={project.links.cargo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline text-muted hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink size={12} />
                    crates.io
                  </a>
                )}
                {project.links?.aur && (
                  <a
                    href={project.links.aur}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline text-muted hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink size={12} />
                    aur
                  </a>
                )}
                {project.links?.npm && (
                  <a
                    href={project.links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline text-muted hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink size={12} />
                    npm
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
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
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return null;
  }

  const featured = projects.find(p => p.featured);
  const other = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-7xl font-bold mb-4">Projects</h2>
        <p className="font-mono text-sm opacity-60">building tools & experiences</p>
      </div>

      {featured && (
        <div className="border border-fg mb-8">
          <div className="border-b border-fg px-6 py-3 flex items-center justify-between">
            <span className="font-mono text-xs opacity-60">[FEATURED]</span>
            {featured.stars && <span className="font-mono text-xs">★ {featured.stars}</span>}
          </div>

          <div className="p-8 md:p-12">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">{featured.name}</h3>
            <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">{featured.description}</p>

            {featured.video && (
              <div className="mb-8 border border-fg">
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
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featured.highlights.map((highlight, idx) => (
                    <div key={idx} className="border border-fg p-4">
                      <span className="font-mono text-xs opacity-60">0{idx + 1}</span>
                      <p className="mt-2 text-sm">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 font-mono text-sm pt-6 border-t border-fg">
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-fg hover:bg-fg hover:text-bg transition-colors"
              >
                → github
              </a>
              {featured.links?.cargo && (
                <a
                  href={featured.links.cargo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-fg hover:bg-fg hover:text-bg transition-colors"
                >
                  → crates.io
                </a>
              )}
              {featured.links?.aur && (
                <a
                  href={featured.links.aur}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-fg hover:bg-fg hover:text-bg transition-colors"
                >
                  → aur
                </a>
              )}
              {featured.links?.npm && (
                <a
                  href={featured.links.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-fg hover:bg-fg hover:text-bg transition-colors"
                >
                  → npm
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {other.map((project, idx) => {
          const isLast = idx === other.length - 1;
          const isOdd = other.length % 2 !== 0;
          const shouldSpan = isLast && isOdd;

          return (
            <div
              key={project.id}
              className={`border border-fg ${shouldSpan ? 'md:col-span-2' : ''}`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                <p className="mb-6 leading-relaxed text-sm opacity-90">{project.description}</p>

                {project.highlights && project.highlights.length > 0 && (
                  <ul className="mb-6 space-y-2">
                    {project.highlights.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="font-mono text-xs opacity-60">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-3 font-mono text-xs pt-4 border-t border-fg">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    → github
                  </a>
                  {project.links?.cargo && (
                    <a
                      href={project.links.cargo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      → crates.io
                    </a>
                  )}
                  {project.links?.aur && (
                    <a
                      href={project.links.aur}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      → aur
                    </a>
                  )}
                  {project.links?.npm && (
                    <a
                      href={project.links.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      → npm
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

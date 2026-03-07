import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router";
import { projects } from "../data/projects";
import { MarkdownContent } from "../components/markdown-content";
import { AsciinemaPlayer } from "../components/asciinema-player";
import { useMeta } from "../hooks/use-meta";

export function ProjectPost() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const project = projects.find((p) => p.id === projectId);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    fetch(`/projects/${project.file}`)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("Failed to load project content."));
  }, [project]);

  useMeta({
    title: project?.title ?? "Project not found",
    ogImage: project ? `/og/projects/${project.id}.png` : undefined,
    url: project ? `/projects/${project.id}` : undefined,
  });

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  const backTo = from === "home" ? "/" : "/projects";
  const backLabel = from === "home" ? "Back to home" : "Back to projects";

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        {backLabel}
      </Link>

      <article>
        <div className="mb-8">
          <h1 className="font-['IBM_Plex_Mono'] text-3xl md:text-4xl mb-2">
            {project.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <time>{project.date}</time>
            <span className="font-['IBM_Plex_Mono']">{project.version}</span>
          </div>
        </div>

        {project.media && project.media.length > 0 && (
          <div className="mb-8 space-y-6">
            {project.media.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden border border-[var(--border)]"
              >
                {item.type === "cast" ? (
                  <AsciinemaPlayer src={item.url} />
                ) : item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.caption || `Project media ${index + 1}`}
                    className="w-full"
                  />
                ) : (
                  <video src={item.url} controls className="w-full" />
                )}
                {item.caption && (
                  <p className="text-sm text-[var(--muted)] text-center py-2">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {content === null ? (
          <p className="text-[var(--muted)]">Loading...</p>
        ) : (
          <MarkdownContent content={content} title={project.title} />
        )}
      </article>
    </div>
  );
}

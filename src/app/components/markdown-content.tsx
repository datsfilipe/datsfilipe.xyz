import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  title?: string;
}

export function MarkdownContent({ content, title }: MarkdownContentProps) {
  const firstH1Skipped = useRef(false);
  firstH1Skipped.current = false;

  return (
    <div className="prose max-w-none markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => {
            const text =
              typeof children === 'string'
                ? children
                : Array.isArray(children)
                  ? children.join('')
                  : String(children ?? '');
            if (title && !firstH1Skipped.current && text === title) {
              firstH1Skipped.current = true;
              return null;
            }
            return <h1 className="font-['IBM_Plex_Mono'] text-3xl mt-8 mb-4">{children}</h1>;
          },
          h2: ({ children }) => (
            <h2 className="font-['IBM_Plex_Mono'] text-2xl mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-['IBM_Plex_Mono'] text-xl mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-[var(--inline-code-bg)] px-1.5 py-0.5 rounded text-sm font-['IBM_Plex_Mono']">
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => (
            <pre className="bg-[var(--code-block-bg)] p-4 rounded-lg overflow-x-auto mb-4 text-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="italic text-[var(--muted)] my-4">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-[var(--border)]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[var(--inline-code-bg)]">{children}</thead>,
          tr: ({ children }) => <tr className="border-b border-[var(--border)]">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-['IBM_Plex_Mono'] border border-[var(--border)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border border-[var(--border)]">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

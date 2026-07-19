import { Link } from 'react-router';
import { D3Tooltip } from '../components/d3-tooltip';
import { NFTCard } from '../components/nft-card';
import { RicingTooltip } from '../components/ricing-tooltip';
import { posts } from '../data/posts';
import { projects } from '../data/projects';
import { useMeta } from '../hooks/use-meta';

export function Home() {
  useMeta('datsfilipe');
  const latestPosts = posts.slice(0, 4);
  const displayProjects = projects;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <section className="grid md:grid-cols-[1fr_300px] gap-12 mb-16">
        <div>
          <h1 className="font-['IBM_Plex_Mono'] text-3xl md:text-4xl mb-6">Filipe Lima</h1>
          <div className="text-base md:text-lg leading-relaxed space-y-4">
            <p>
              24-year-old full-stack developer at{' '}
              <D3Tooltip>
                The world's first blockchain to tokenize internet domains, bridging Web2 domains and
                Web3 ecosystems.
              </D3Tooltip>
              , experienced in building modern web applications with JavaScript and TypeScript.
              Pursuing a Bachelor's degree in Computer Science (2023–current). Outside work I{' '}
              <RicingTooltip />, solve Sudoku, and watch anime. I'm currently learning digital
              drawing and Japanese.
            </p>
            <p className="text-sm text-[var(--muted)]">
              Reach me at{' '}
              <a
                href="mailto:contact@datsfilipe.xyz"
                className="text-[var(--accent)] hover:underline"
              >
                contact@datsfilipe.xyz
              </a>
              .
            </p>
          </div>
        </div>

        <div className="hidden md:flex md:items-start md:justify-end">
          <NFTCard
            imageUrl="https://cdn.doma.xyz/tokens/b259a1e06ccc878f7994b6fc2cf5e62cde0e8f24b24f3ac8030b4a3449ef55cb.png"
            title="datsfilipe.xyz NFT (ERC-721)"
            link="https://explorer.doma.xyz/token/0xd000000000009E6bEa0bA0c5D964AE98d59ED318/instance/47487272558509317213930185944017961866450788946257529985531772416038851331075"
          />
        </div>
      </section>

      <section className="md:hidden mb-12">
        <a
          href="https://explorer.doma.xyz/token/0xd000000000009E6bEa0bA0c5D964AE98d59ED318/instance/47487272558509317213930185944017961866450788946257529985531772416038851331075"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4"
        >
          <div className="flex-shrink-0">
            <img
              src="https://cdn.doma.xyz/tokens/b259a1e06ccc878f7994b6fc2cf5e62cde0e8f24b24f3ac8030b4a3449ef55cb.png"
              alt="datsfilipe.xyz NFT"
              className="w-20 h-20 rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--muted)]">datsfilipe.xyz NFT (ERC-721)</p>
          </div>
        </a>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['IBM_Plex_Mono'] text-2xl">Latest Posts</h2>
          <Link to="/blog" className="text-sm text-[var(--accent)] hover:underline">
            show more
          </Link>
        </div>
        <div className="full-bleed-lines">
          {latestPosts.map((post) => {
            const content = (
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 md:gap-4">
                <div className="flex-1">
                  <h3 className="text-lg">{post.title}</h3>
                  {post.source && <p className="text-sm text-[var(--muted)]">{post.source}</p>}
                </div>
                <span className="text-sm text-[var(--muted)] md:whitespace-nowrap">
                  {post.date}
                </span>
              </div>
            );
            const className =
              'block py-4 hover:bg-[var(--hover-bg)] transition-colors notebook-line';
            return post.external ? (
              <a
                key={post.id}
                href={post.external}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={post.id} to={`/blog/${post.id}?from=home`} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section id="projects" className="mb-16 scroll-mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['IBM_Plex_Mono'] text-2xl">Active Projects</h2>
          <Link to="/projects" className="text-sm text-[var(--accent)] hover:underline">
            show more
          </Link>
        </div>
        <div className="full-bleed-lines">
          {displayProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}?from=home`}
              className="block py-4 hover:bg-[var(--hover-bg)] transition-colors notebook-line"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-4">
                <h3 className="text-lg flex-1">{project.title}</h3>
                <span className="text-sm text-[var(--muted)] md:whitespace-nowrap">
                  {project.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client'

import { useCallback, useState } from 'react';
import { useWindowSize } from 'app/hooks/useWindowSize';
import { cx } from '../utils'

const projectItems = {
  'Bad Apple': {
    link: 'https://react-bad-apple.vercel.app/',
    description: 'The classic Bad Apple animation rendered in React',
    year: '2023'
  },
  'Vercel UI Clone': {
    link: 'https://vercel-ui-clone-three.vercel.app',
    description: 'A clone of Vercel UI using React',
    year: '2023'
  },
  'React Jokenpo': {
    link: 'https://react-jokenpo-alpha.vercel.app/',
    description: 'Weird Jokenpo game made with React with intent of learning more about state management',
    year: '2023'
  },
  'Wiserick': {
    link: 'https://wiserick-next-app.vercel.app',
    description: 'Wise big-headed Rick advises you about whatever he wants',
    year: '2023'
  },
  'Binary Rain': {
    link: 'https://codesandbox.io/p/github/datsfilipe/binary-rain/main',
    description: 'A rain animation with 1\'s and 0\'s made using codesandbox',
    year: '2023'
  },
  'Sudoku': {
    link: 'https://sudoku-rho-six.vercel.app/',
    description: 'Sudoku game made with React',
    year: '2023'
  },
  'Hot Take Cats': {
    link: 'https://hot-take-cats.vercel.app/',
    description: 'Cats give their opinion on technical, subjects',
    year: '2023'
  },
  'My Rices': {
    link: 'https://myrices.datsfilipe.dev/',
    description: 'Collection of unix rices I\'ve made',
    year: '2023'
  },
  'elixir-inets-server': {
    link: 'https://github.com/datsfilipe/elixir-inets-server',
    description: 'Simple elixir server made with Erlang inets API',
    year: '2023'
  },
  'rinha-backend-go': {
    link: 'https://github.com/datsfilipe/rinha-backend-go',
    description: 'Golang server made for supporting a lot of requests per second in order to solve a proposed challenge',
    year: '2023'
  },
  'Bun interpreter': {
    link: 'https://github.com/datsfilipe/rinha-de-compiler',
    description: 'A tiny interpreter made with bun in order to participate in a competition',
    year: '2023'
  },
  'Linux Shimeji': {
    link: 'https://github.com/datsfilipe/linux-shimeji',
    description: 'Shimeji for Linux. Added easy-to-use flake to an existing java project',
    year: '2025'
  },
  'Basic Blockchain': {
    link: 'https://github.com/datsfilipe/basic-blockchain-in-rust',
    description: 'Basic and feature-less blockchain implementation in rust',
    year: '2024'
  },
  'dotfiles': {
    link: 'https://github.com/datsfilipe/dotfiles',
    description: 'Personal config files for NixOS',
    year: '2023'
  },
  'nix-envs': {
    link: 'https://github.com/datsfilipe/nix-envs',
    description: 'Nix powered development environment templates',
    year: '2025'
  },
  'vesper.nvim': {
    link: 'https://github.com/datsfilipe/vesper.nvim',
    description: 'Porting Vesper theme from Visual Studio Code to Neovim',
    year: '2024'
  },
  'min-theme.nvim': {
    link: 'https://github.com/datsfilipe/min-theme.nvim',
    description: 'Porting Min theme from Visual Studio Code to Neovim',
    year: '2024'
  },
  'gruvbox.nvim': {
    link: 'https://github.com/datsfilipe/gruvbox.nvim',
    description: 'Gruvbox dark colorscheme for Neovim',
    year: '2025'
  },
};

export default function Page() {
  const [hoveredProject, setHoveredProject] = useState<keyof typeof projectItems | null>(null);
  const [isIframeVisible, setIsIframeVisible] = useState(false);

  const { width } = useWindowSize();

  const handleCardClick = useCallback(
    (projectName: keyof typeof projectItems) => {
      if (projectItems[projectName].link.startsWith('https://github') || (width && width < 768)) {
        window.open(projectItems[projectName].link, '_blank');
        return; // don'show the iframe for github links
      }

      setHoveredProject(projectName);
      setIsIframeVisible(true);
    }, [width]
  );

  const handleClose = () => {
    setIsIframeVisible(false);
  };

  return (
    <section className="relative">
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My projects</h1>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr]">
        {Object.entries(projectItems).map(([name, { description, link }]) => {
          const hasPreview = !link.startsWith('https://github')

          return (
            <div
              key={name}
              className={cx(
                "relative w-full sm:w-[300px] h-[200px] p-5 border border-neutral-100 dark:border-neutral-900",
                "rounded-xl flex flex-col cursor-pointer transition-all hover:bg-neutral-900"
              )}
              onClick={() => handleCardClick(name as keyof typeof projectItems)}
            >
              {hasPreview && (width && width > 768) && (
                <div className="absolute top-2 right-2 bg-neutral-300 dark:bg-neutral-800 text-black dark:text-white text-xs font-semibold px-2 py-1 rounded">
                  Preview
                </div>
              )}
              <div className="flex flex-1 items-center justify-center">
                <h2 className="font-semibold text-center text-xl tracking-tighter text-neutral-700 dark:text-neutral-300">{name}</h2>
              </div>
              <p className="text-neutral-300 dark:text-neutral-600 mt-auto">{description}</p>
            </div>
          )
        })}
      </div>

      {isIframeVisible && hoveredProject && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="fixed inset-6 bg-neutral-200 dark:bg-neutral-900 shadow-xl rounded-md z-50 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-2 border-b dark:border-neutral-700 border-dashed">
              <h3 className="font-semibold text-neutral-400">{hoveredProject} Preview</h3>
              <button
                onClick={handleClose}
                className={cx(
                  "p-1 rounded-full transition-all cursor-pointer hover:text-neutral-800 text-neutral-600",
                  "hover:dark:text-neutral-200 dark:text-neutral-400"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 p-5">
              <iframe
                src={projectItems[hoveredProject].link}
                width="100%"
                height="100%"
                title={hoveredProject}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

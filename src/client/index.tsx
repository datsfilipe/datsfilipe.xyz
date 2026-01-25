import { createRoot } from 'react-dom/client';
import { setupLiveReload } from '@client/libs/live-reload';
import { DarkModeToggle } from '@client/components/dark-mode-toggle';
import { Hero } from '@client/components/hero';
import { ProjectsGrid } from '@client/components/projects-grid';
import { BlogSection } from '@client/components/blog-section';
import { NotesTree } from '@client/components/notes-tree';
import { RicesGallery } from '@client/components/rices-gallery';

import '@client/styles/global.css';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function App() {
  return (
    <div className="min-h-screen bg-bg text-fg font-sans">
      <DarkModeToggle />

      <main>
        <Hero />
        <ProjectsGrid />
        <BlogSection />
        <NotesTree />
        <RicesGallery />
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-12 mt-12">
        <div className="border-t border-subtle pt-8 flex items-center justify-between">
          <span className="font-mono text-sm text-muted">datsfilipe © {new Date().getFullYear()}</span>
          <button
            onClick={scrollToTop}
            className="btn btn-outline hover:scale-105 active:scale-95"
          >
            ↑ back to top
          </button>
        </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('elysia')!);
root.render(<App />);

setupLiveReload();

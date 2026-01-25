import { createRoot } from 'react-dom/client';
import { setupLiveReload } from '@client/libs/live-reload';
import { DarkModeToggle } from '@client/components/dark-mode-toggle';
import { Hero } from '@client/components/hero';
import { ProjectsGrid } from '@client/components/projects-grid';
import { BlogSection } from '@client/components/blog-section';
import { NotesTree } from '@client/components/notes-tree';
import { RicesGallery } from '@client/components/rices-gallery';

import '@client/styles/global.css';

function App() {
  return (
    <div className="min-h-screen bg-bg text-fg font-sans">
      <DarkModeToggle />

      <main>
        <Hero />

        <div className="border-t border-fg" />
        <ProjectsGrid />

        <div className="border-t border-fg" />
        <BlogSection />

        <div className="border-t border-fg" />
        <NotesTree />

        <div className="border-t border-fg" />
        <RicesGallery />
      </main>

      <footer className="border-t border-fg py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center font-mono text-sm">
          <p>datsfilipe © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('elysia')!);
root.render(<App />);

setupLiveReload();

import { createRoot } from 'react-dom/client';

import Layout from '@client/layouts';
import { setupLiveReload } from '@client/libs/live-reload';

function App() {
  return (
    <>
      <img src="/images/maddelena-1.webp" className="max-w-40 rounded-full" />
      <h1 className="text-4xl font-bold">datsfilipe.xyz</h1>
      <p className="text-gray-600 text-center max-w-md">23yo fullstack software engineer</p>

      <div className="flex flex-col gap-4 mt-8">
        <a
          href="/notes"
          className="text-lg text-blue-600 hover:text-blue-700 px-8 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all text-center font-medium"
        >
          notes
        </a>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('elysia')!);
root.render(
  <Layout className="gap-6">
    <App />
  </Layout>,
);

setupLiveReload();

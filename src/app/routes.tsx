import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout';
import { Blog } from './pages/blog';
import { BlogPost } from './pages/blog-post';
import { Home } from './pages/home';
import { NotFound } from './pages/not-found';
import { ProjectPost } from './pages/project-post';
import { Projects } from './pages/projects';
import { Rices } from './pages/rices';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'blog', Component: Blog },
      { path: 'blog/:postId', Component: BlogPost },
      { path: 'projects', Component: Projects },
      { path: 'projects/:projectId', Component: ProjectPost },
      { path: 'rices', Component: Rices },
      { path: '*', Component: NotFound },
    ],
  },
]);

import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Blog } from "./pages/blog";
import { BlogPost } from "./pages/blog-post";
import { Projects } from "./pages/projects";
import { ProjectPost } from "./pages/project-post";
import { Rices } from "./pages/rices";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "blog", Component: Blog },
      { path: "blog/:postId", Component: BlogPost },
      { path: "projects", Component: Projects },
      { path: "projects/:projectId", Component: ProjectPost },
      { path: "rices", Component: Rices },
      { path: "*", Component: NotFound },
    ],
  },
]);

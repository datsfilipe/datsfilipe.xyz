export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  stars?: string;
  featured?: boolean;
  video?: string;
  links?: {
    cargo?: string;
    aur?: string;
    npm?: string;
    demo?: string;
  };
  highlights?: string[];
}

export async function getProjects(): Promise<Project[]> {
  const file = Bun.file('public/projects.json');
  const projects = await file.json();
  return projects;
}

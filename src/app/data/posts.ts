export interface Post {
  id: string;
  title: string;
  date: string;
  file?: string;
  cover?: string;
  /** External URL. When set, the post links out instead of to an internal page. */
  external?: string;
  /** Where an external post lives (e.g. "dotfiles.substack.com"). Signals Filipe isn't the author. */
  source?: string;
}

export const posts: Post[] = [
  {
    id: 'dotfiles-interview-47',
    title: 'Dotfiles Newsletter (47 - Filipe Lima)',
    date: '2026-01-08',
    external: 'https://dotfiles.substack.com/p/47-filipe-lima',
    source: 'dotfiles.substack.com',
  },
  {
    id: 'my-development-environment',
    title: 'My Development Environment',
    date: '2023-11-27',
    file: 'my_development_environment.md',
  },
  {
    id: 'why-arent-you-using-astro',
    title: "Why aren't you using Astro?",
    date: '2023-08-17',
    file: 'why_arent_you_using_astro.md',
    cover: '/astro-cover.png',
  },
].sort((a, b) => b.date.localeCompare(a.date));

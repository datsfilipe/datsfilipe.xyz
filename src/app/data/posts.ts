export interface Post {
  id: string;
  title: string;
  date: string;
  file: string;
  cover?: string;
}

export const posts: Post[] = [
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
];

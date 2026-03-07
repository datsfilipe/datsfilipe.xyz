declare module 'asciinema-player' {
  export function create(
    src: string,
    element: HTMLElement,
    opts?: Record<string, unknown>,
  ): { dispose: () => void };
}

declare module 'asciinema-player/dist/bundle/asciinema-player.css';

import 'asciinema-player/dist/bundle/asciinema-player.css';
import { useEffect, useRef } from 'react';

export function AsciinemaPlayer({ src, ...props }: { src: string } & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!ref.current) return;

    import('asciinema-player').then((AsciinemaPlayerLib) => {
      if (!ref.current) return;
      playerRef.current = AsciinemaPlayerLib.create(src, ref.current, {
        fit: 'width',
        autoPlay: true,
        loop: true,
        speed: 1.5,
        terminalFontFamily: "'IBM Plex Mono', monospace",
        theme: 'custom',
        ...props,
      });
    });

    return () => {
      if (
        playerRef.current &&
        typeof (playerRef.current as { dispose?: () => void }).dispose === 'function'
      ) {
        (playerRef.current as { dispose: () => void }).dispose();
      }
      if (ref.current) {
        ref.current.innerHTML = '';
      }
      playerRef.current = null;
    };
  }, [src]);

  return <div ref={ref} />;
}

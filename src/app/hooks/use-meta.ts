import { useEffect } from 'react';

export function useMeta(title: string) {
  useEffect(() => {
    const fullTitle = title === 'datsfilipe' ? title : `${title} — datsfilipe`;
    document.title = fullTitle;

    return () => {
      document.title = 'datsfilipe';
    };
  }, [title]);
}

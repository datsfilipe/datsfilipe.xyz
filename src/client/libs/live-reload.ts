export function setupLiveReload() {
  if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
    return;
  }

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';

  if (!isLocalhost) {
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/live-reload`);

  ws.addEventListener('open', () => {
    console.log('live reload enabled');
  });

  ws.addEventListener('message', (event) => {
    if (event.data === 'reload') {
      console.log('reloading page...');
      window.location.reload();
    }
  });

  ws.addEventListener('close', () => {
    console.log('live reload disconnected');
  });
}

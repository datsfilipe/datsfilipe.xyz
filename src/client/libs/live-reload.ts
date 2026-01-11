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

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let ws: WebSocket | null = null;

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/live-reload`);

    ws.addEventListener('open', () => {
      console.log('live reload connected');

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    });

    ws.addEventListener('message', (event) => {
      if (event.data === 'refresh') {
        console.log('reloading page...');
        window.location.reload();
      }
    });

    ws.addEventListener('close', () => {
      console.log('live reload disconnected, attempting to reconnect...');

      reconnectTimer = setTimeout(() => {
        connect();
      }, 1000);
    });

    ws.addEventListener('error', (err) => {
      console.error('live reload error:', err);
      ws?.close();
    });
  }

  connect();
}

export function setupLiveReload() {
  if (typeof window === 'undefined' || window.location.hostname !== 'localhost') {
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/live-reload`);

  ws.onmessage = (event) => {
    if (event.data === 'refresh') {
      window.location.reload();
    }
  };

  ws.onerror = () => {};
}

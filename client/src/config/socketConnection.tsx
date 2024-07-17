import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

const setupWebSocketConnection = () => {
  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: 'pusher',
    key: 'staging',
    cluster: 'mt1',
    wsHost: window.location.hostname,
    wsPort: 6002,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  });

  return echo;
};

export default setupWebSocketConnection;

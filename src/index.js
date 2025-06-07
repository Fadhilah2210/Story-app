import './styles/style.css';
import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app.js';
import Camera from './utils/camera.js';
import registerPushNotification from './utils/push-notification.js'; // ✅ Tambahan

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });

  // ✅ Inisialisasi Push Notification setelah halaman dimuat
  registerPushNotification();

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    Camera.stopAllStreams();
  });
});

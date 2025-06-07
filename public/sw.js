const CACHE_NAME = 'story-app-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/bundle.js',
  '/manifest.json',
  '/styles/style.css',
];

// Cache static files saat install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // aktifkan langsung SW
});

// Bersihkan cache lama saat SW baru diaktifkan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // langsung kontrol halaman
});

// Handle fetch: cache first, then network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          caches.match('/offline.html') // fallback jika offline
        )
      );
    })
  );
});

// Push notification
self.addEventListener('push', (event) => {
  let title = 'Push Notification';
  let options = {
    body: 'Anda menerima notifikasi baru!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      options = { ...options, ...data.options };
    } catch (error) {
      console.error('Push message data parsing error:', error);
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// Klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

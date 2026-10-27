const CACHE_NAME = 'joydata-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/joydata-icon-192.svg',
  '/joydata-icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Never cache API calls to avoid stale operational data (§14.7 mainIdea.md)
  if (url.pathname.startsWith('/api')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((res) => {
          if (res.status === 200 && event.request.method === 'GET') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        }).catch(() => caches.match('/'))
      );
    })
  );
});

// Web Push event listener (§14.8 mainIdea.md)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { bodies: { id: event.data.text() } };
    }
  }

  const title =
    data.titles?.id ||
    data.title ||
    'Pemberitahuan JOYdata';
  const body =
    data.bodies?.id ||
    data.body ||
    'Ada pembaruan data akademik di JOYdata.';
  const icon = data.icon || '/joydata-icon-192.svg';
  const badge = data.badge || '/joydata-icon-192.svg';
  const targetUrl = data.deepLink || data.data?.url || '/dashboard';

  const options = {
    body,
    icon,
    badge,
    data: {
      url: targetUrl,
      raw: data,
    },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Deep-linking on notification click (§14.8 mainIdea.md)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});


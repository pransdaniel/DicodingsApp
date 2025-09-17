// sw.js
const CACHE_NAME = 'dicoding-story-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/src/images/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((networkResponse) => {
          // Cache API responses for offline
          if (event.request.url.startsWith('https://story-api.dicoding.dev/v1/stories')) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {
          // Offline fallback to app shell
          return caches.match('/index.html');
        });
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.options.body,
    icon: '/src/images/favicon.png',
    data: { url: `#/stories/${data.storyId}` }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
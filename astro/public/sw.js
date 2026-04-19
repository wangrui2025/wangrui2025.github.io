const CACHE_NAME = 'app-shell-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/robots.txt',
  '/gs_data.json'
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for HTML pages (fresh content), cache-first for immutable static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for navigation/HTML requests (always get fresh content)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request) ?? caches.match('/'))
    );
    return;
  }

  // Cache-first for static assets with immutable hint (same-origin only)
  // Static assets: JS, CSS, images, fonts — cached aggressively since they have content-hash names
  if (url.origin === location.origin) {
    const isStaticAsset =
      /\.(js|css|woff2?|ttf|eot|ico|png|jpg|jpeg|webp|svg|avif|json|xml|woff)(\?.*)?$/.test(url.pathname);

    if (isStaticAsset) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
            }
            return response;
          });
        })
      );
      return;
    }

    // For other same-origin requests (e.g., data JSON), network-first
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});

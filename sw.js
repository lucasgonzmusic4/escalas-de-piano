const CACHE_NAME = 'escalas-piano-v2'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Error guardando en caché:', err);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  // REGLA DE ORO: Deja pasar el login (POST) y Google Script directo a internet
  if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
    return; 
  }

  // Todo lo demás (visuales) lo saca del caché para el modo offline
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

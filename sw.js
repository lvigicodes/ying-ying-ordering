const CACHE_VERSION = 'v1.0.0';
const urlsToCache = [
  '/menu.html',
  '/staff.html',
  '/index.html',
  '/yingyinglogo.jpg'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Force immediate activation
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();
        
        // Update cache with fresh content
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
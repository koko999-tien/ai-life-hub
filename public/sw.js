// Service Worker for AI Life Hub - Offline First
const CACHE_NAME = 'ai-life-hub-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/search-index.json',
];

const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: ['/fonts/', '/images/', '/icons/'],
  // Network first for HTML pages
  pages: ['/category/', '/skill/', '/search', '/resources'],
  // Stale while revalidate for API/search
  api: ['/api/'],
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Determine strategy
  let strategy = 'network-first';

  if (CACHE_STRATEGIES.static.some((path) => url.pathname.startsWith(path))) {
    strategy = 'cache-first';
  } else if (CACHE_STRATEGIES.pages.some((path) => url.pathname.startsWith(path))) {
    strategy = 'network-first';
  } else if (CACHE_STRATEGIES.api.some((path) => url.pathname.startsWith(path))) {
    strategy = 'stale-while-revalidate';
  }

  event.respondWith(handleRequest(request, strategy));
});

async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);

  switch (strategy) {
    case 'cache-first':
      return cacheFirst(request, cache);
    case 'network-first':
      return networkFirst(request, cache);
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, cache);
    default:
      return networkFirst(request, cache);
  }
}

async function cacheFirst(request, cache) {
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cache) {
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Background sync for form submissions (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  // Implement if needed for offline favorites sync
  console.log('Syncing favorites...');
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
}
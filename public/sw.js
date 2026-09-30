/**
 * Fur Furniture Studio - Enterprise Service Worker (v3)
 * Guarantees zero stale chunk locks and prevents blank white screens on Netlify
 */

const CACHE_NAME = 'fur-studio-v3';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/cambodia.jpg',
  '/location.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA: Precache notice:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('PWA: Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Allow client app to trigger instant cache clearance & update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PURGE_CACHE') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      if (event.source) {
        event.source.postMessage({ type: 'CACHE_PURGED' });
      }
    });
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation requests (HTML pages on any URL): ALWAYS Network-First
  // This guarantees fresh index.html with current build JS/CSS hashes on Netlify
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If completely offline, fall back to cached index.html
          return caches.match('/index.html').then((cached) => {
            if (cached) return cached;
            return new Response(
              '<!doctype html><html><body style="font-family:system-ui;text-align:center;padding:40px;background:#FAF8F5;"><h2>Fur Studio Offline</h2><p>Please check your connection and reload.</p><button onclick="window.location.reload()" style="padding:10px 20px;border-radius:99px;background:#292524;color:#fff;border:none;">Reload</button></body></html>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          });
        })
    );
    return;
  }

  // 2. Vite hashed production assets (/assets/*):
  // Check cache first. If not cached, fetch from network.
  // CRITICAL: If the fetch returns 404 or text/html, this indicates an outdated HTML is requesting
  // deleted chunks from a previous Netlify deployment!
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request)
          .then((response) => {
            const contentType = response.headers.get('content-type') || '';
            const isHtmlInsteadOfAsset = contentType.includes('text/html');
            const isNotFound = response.status === 404;

            // Stale deployment detected:
            if (isNotFound || isHtmlInsteadOfAsset) {
              console.warn('[SW] Stale chunk requested (404/HTML trap). Purging cached index.html:', event.request.url);
              // Invalidate cached index.html so next navigation gets fresh deployment
              caches.open(CACHE_NAME).then((cache) => cache.delete('/index.html'));

              // Inform all open tabs that a deployment mismatch was encountered
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: 'DEPLOYMENT_MISMATCH',
                    url: event.request.url
                  });
                });
              });

              return response;
            }

            // Normal valid asset response: cache for offline performance
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }

            return response;
          })
          .catch((err) => {
            console.warn('[SW] Asset fetch failed:', event.request.url, err);
            caches.open(CACHE_NAME).then((cache) => cache.delete('/index.html'));
            throw err;
          });
      })
    );
    return;
  }

  // 3. Static icons and images: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

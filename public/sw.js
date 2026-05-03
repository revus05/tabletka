const STATIC_CACHE = "tabletka-static-v1";
const RUNTIME_CACHE = "tabletka-runtime-v1";

// Static assets to pre-cache
const PRECACHE_URLS = ["/", "/search"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.delete(RUNTIME_CACHE).then(() => {
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "CACHE_CLEARED" });
          });
        });
      }),
    );
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Skip API routes — always network
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) {
    return;
  }

  // Static assets (images, fonts) — Cache First
  if (/\.(png|jpg|jpeg|webp|svg|woff2?|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // HTML Pages — Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request).then((cached) => {
          if (cached) {
            return cached;
          }
          // Return a basic offline page if nothing is cached
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      }),
  );
});

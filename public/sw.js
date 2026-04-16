const CACHE_NAME = "fortis-os-v1";
const OFFLINE_PAGE = "/offline";

// Pages to cache immediately
const PRE_CACHE = [
  "/",
  "/uju-cycle",
  "/ikenga",
  "/ask-ujris",
  "/payment",
];

// Install: pre-cache key pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE).catch(() => {
        // Silently ignore if some pages fail during install
      });
    }),
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for pages/assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // API routes: network only, no cache
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Pages + assets: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached || new Response("Offline", { status: 503 }));

      return cached || fetchPromise;
    }),
  );
});

// Background sync: replay offline API submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "offline-submissions") {
    event.waitUntil(replayOfflineSubmissions());
  }
});

async function replayOfflineSubmissions() {
  // Submissions are stored in localStorage by the client;
  // this is a placeholder for future IndexedDB-based sync.
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: "SYNC_OFFLINE" });
  });
}

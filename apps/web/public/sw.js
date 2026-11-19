/**
 * OpenBarrio Minimal Versioned Service Worker (PWA Visit Mode)
 * - Versioned shell cache (`ob-shell-v<APP_VERSION>`) purged automatically on activate
 * - Controlled manual updates (never calls skipWaiting automatically on install)
 * - Network-only bypass for all API endpoints, excluded routes, non-GET, and cross-origin requests
 * - Stale-while-revalidate for same-origin static assets; shell fallback for offline navigation
 */

const APP_VERSION = '1.4.0';
const SHELL_CACHE_PREFIX = 'ob-shell-v';
const SHELL_CACHE_NAME = SHELL_CACHE_PREFIX + APP_VERSION;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/metodologia',
  '/privacidad',
];

const EXCLUDED_PATH_PREFIXES = [
  '/api/v1/listing/resolve',
  '/api/v1/telemetry',
  '/api/v1/status/sources',
  '/api/v1/tiles',
];

const OFFLINE_SHELL_ROUTES = new Set([
  '/',
  '/index.html',
  '/metodologia',
  '/methodology',
  '/metodoloxia',
  '/privacidad',
  '/privacy',
  '/privacitat',
  '/privacidade',
  '/pribatutasuna',
]);

const STATIC_ASSET_REGEX = /\.(?:js|mjs|css|svg|png|webp|ico|woff2?)$/i;

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isExcludedPath(pathname) {
  if (pathname.startsWith('/api/')) return true;
  return EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isStaticAssetPath(pathname) {
  return (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/icons/') ||
    pathname === '/manifest.webmanifest' ||
    STATIC_ASSET_REGEX.test(pathname)
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          const response = await fetch(new Request(url, { cache: 'reload' }));
          if (response && response.ok) {
            await cache.put(url, response);
          }
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys
          .filter((key) => key.startsWith(SHELL_CACHE_PREFIX) && key !== SHELL_CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey))
      );
      if (self.clients && typeof self.clients.claim === 'function') {
        await self.clients.claim();
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return;

  if (event.data.type === 'SKIP_WAITING') {
    if (typeof self.skipWaiting === 'function') {
      self.skipWaiting();
    }
    return;
  }

  if (event.data.type === 'CLEAR_SHELL_CACHE') {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(SHELL_CACHE_PREFIX))
            .map((key) => caches.delete(key))
        )
      )
    );
  }
});

async function handleNavigationRequest(request, url) {
  const cache = await caches.open(SHELL_CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const normalized = normalizePathname(url.pathname);
      if (OFFLINE_SHELL_ROUTES.has(normalized)) {
        await cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch {
    const exactMatch = await cache.match(request);
    if (exactMatch) return exactMatch;

    const indexShell = await cache.match('/index.html');
    if (indexShell) return indexShell;

    const rootShell = await cache.match('/');
    if (rootShell) return rootShell;

    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

async function handleStaticAssetRequest(event, request) {
  const cache = await caches.open(SHELL_CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok && (!response.type || response.type === 'basic')) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    if (typeof event.waitUntil === 'function') {
      event.waitUntil(networkPromise);
    }
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  return new Response('Offline Asset Unavailable', { status: 504 });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!request || request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;
  if (isExcludedPath(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request, url));
    return;
  }

  if (isStaticAssetPath(url.pathname)) {
    event.respondWith(handleStaticAssetRequest(event, request));
  }
});

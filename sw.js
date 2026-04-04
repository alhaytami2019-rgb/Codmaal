// ═══════════════════════════════════════════════
// CODMAAL — Service Worker v1
// ═══════════════════════════════════════════════
const CACHE_NAME = 'dhageyso-v1';

const SHELL_FILES = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './nasheeds-data.js',
    './lectures-data.js',
];

// Install: cache app shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(SHELL_FILES))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: cache-first for shell, network-first for audio
self.addEventListener('fetch', event => {
    const url = event.request.url;
    const isAudio = url.includes('.mp3');

    if (isAudio) {
        // Network-first for audio, cache on success
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for everything else
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (!response || response.status !== 200) return response;
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            });
        }).catch(() => {
            if (event.request.mode === 'navigate') {
                return new Response('<h1 style="font-family:sans-serif;text-align:center;padding:40px">Offline</h1>', {
                    headers: { 'Content-Type': 'text/html' }
                });
            }
        })
    );
});

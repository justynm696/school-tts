// V.I.R.A. Service Worker - PWA Offline Support
const CACHE_NAME = 'vira-celtech-v2.1.0';
const urlsToCache = [
    './',
    './index.html',
    './navigation.html',
    './admin.html',
    './guide.html',
    './styles.css',
    './admin.css',
    './app.js',
    './data.js',
    './db.js',
    './supabase-client.js',
    './navigation.js',
    './celtech_logo.png',
    './celtech_building.jpg',
    './vira_logo.png',
    './floor_1st.jpg',
    './floor_2nd.jpg',
    './floor_3rd.jpg',
    './floor_4th.jpg',
    './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing V.I.R.A. Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating V.I.R.A. Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Return offline page or default response
                    return new Response('Offline - V.I.R.A. requires internet connection for some features', {
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
            })
    );
});

// Background sync for future features
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('[Service Worker] Syncing data...');
    // Future: sync user preferences, offline changes, etc.
}

// Push notifications (for future announcements)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from V.I.R.A.',
        icon: './celtech_logo.png',
        badge: './celtech_logo.png',
        vibrate: [200, 100, 200],
        tag: 'vira-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification('V.I.R.A. - Celtech College', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('./')
    );
});

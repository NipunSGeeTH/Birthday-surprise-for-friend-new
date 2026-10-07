const CACHE_NAME = 'saveImagesAsCache-v3';
const IMAGES_TO_CACHE = [
  'src/img/birthwall2.webp',
  'src/img/birthwall5.webp',
  'src/img/birthwall4.webp',
  'src/img/birthwall11.webp',
  'src/img/birthwall1.webp',
  'src/img/calling.webp',
  'src/img/iphonehome.webp',
  'src/img/iphonewall.webp',
  'src/img/gh.webp',
  'src/img/turn-up-volume.webp',
  'src/img/swipbtn3tr.webp'
];

const MAX_CACHE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(IMAGES_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          const headers = response.headers;
          const date = headers.get('date');
          if (date) {
            const age = Date.now() - new Date(date).getTime();
            if (age > MAX_CACHE_AGE) {
              return fetchAndCache(event.request);
            }
          }
          return response; // Return the cached image if not expired
        }
        return fetchAndCache(event.request); // Fetch from the network if not in cache
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});

function fetchAndCache(request) {
  return fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    }
    return networkResponse;
  }).catch(error => {
    console.error('Fetching failed:', error);
    throw error;
  });
}

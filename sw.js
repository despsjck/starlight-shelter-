const CACHE = 'starlight-v1';
const ASSETS = [
  '/starlight-shelter-/',
  '/starlight-shelter-/index.html',
  '/starlight-shelter-/members.html',
  '/starlight-shelter-/exterior.png',
  '/starlight-shelter-/map.png',
  '/starlight-shelter-/lobby.png',
  '/starlight-shelter-/floor1.png',
  '/starlight-shelter-/floor2.png',
  '/starlight-shelter-/floor3.png',
  '/starlight-shelter-/b1.png',
  '/starlight-shelter-/rooftop.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/starlight-shelter-/')))
  );
});

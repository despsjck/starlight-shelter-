const CACHE = 'starlight-v5';

// HTML 파일은 캐시하지 않음 (항상 최신 버전)
const HTML_FILES = [
  '/starlight-shelter-/',
  '/starlight-shelter-/index.html',
  '/starlight-shelter-/members.html',
  '/starlight-shelter-/game.html',
  '/starlight-shelter-/jihye.html',
];

// 이미지 등 정적 파일만 캐시
const STATIC_ASSETS = [
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
    caches.open(CACHE).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
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
  const url = new URL(e.request.url);
  const isHTML = HTML_FILES.some(p => url.pathname === p || url.pathname === p + '/')
    || url.pathname.endsWith('.html');

  if (isHTML) {
    // HTML은 네트워크 우선 — 항상 최신 버전 가져오기
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // 이미지 등 정적 파일은 캐시 우선
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});

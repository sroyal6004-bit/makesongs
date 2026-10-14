// 플레이리스트 스튜디오 서비스워커
// HTML·앱 파일은 네트워크 우선(새 버전 즉시 반영), Firebase SDK(gstatic)만 캐시 우선.
const CACHE = 'makesongs-v1';
const ASSETS = ['./', './index.html', './manifest.json', './firebase-config.js', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  // Firestore / Storage 등 실시간 통신은 절대 캐시하지 않음
  if (/googleapis\.com$|firebaseio\.com$|firebasestorage\.app$|firebaseapp\.com$/.test(url.hostname)) return;
  if (url.hostname === 'www.gstatic.com') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return res;
  }).catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});

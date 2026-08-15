/* 小新工作台 · Service Worker（PWA 离线 + 全屏）
   策略：导航/资源均 network-first —— 每次优先取网络（保证部署更新即时生效），
   网络失败时才回退到缓存，从而实现“离线也能打开”，同时避免旧缓存导致看不到更新。 */
const CACHE = 'xinwb-cache-v1';
const CORE = [
  './', './index.html',
  './assets/styles.css',
  './assets/utils.js', './assets/content.js', './assets/pages.js', './assets/app.js',
  './assets/app-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const cp = res.clone();
          caches.open(CACHE).then(c => c.put(req, cp));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});

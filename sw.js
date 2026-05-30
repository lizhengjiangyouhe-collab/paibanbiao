const CACHE_NAME = 'dangqi-guanjia-v8';
const urlsToCache = [
  './',
  './index.html',
  './tubiao.png',
  './manifest.json',
  './libs/tailwindcss.js',
  './libs/react.production.min.js',
  './libs/react-dom.production.min.js',
  './libs/babel.min.js',
  './libs/lunar.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 核心优化：主文档（根路径或 index.html）采用【网络优先】策略
  // 有网时：绝对保证获取到服务器上的最新版本，消灭缓存滞后 Bug
  // 无网时：立刻无缝降级使用本地缓存，确保离线（飞行模式）秒开
  if (url.pathname === '/' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          }
          return response;
        })
        .catch(() => {
          // 网络异常/离线时，回退到本地缓存
          return caches.match(event.request);
        })
    );
  } else {
    // 静态库和图片等静态资源（它们永远不会改变）依然采用【缓存优先】策略，保证加载速度
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            });
        })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

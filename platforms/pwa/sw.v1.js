/**
 * BUI PWA 离线缓存的资源，每更新一个版本，有3个要修改版本的地方
 * sw.v1.js 要修改名字
 * index.html 里的 sw.v1.js  
 * cacheName 的v1也要修改
 * 用户强制刷新的时候，才会删除之前的缓存，重新缓存
 */
var cacheName = 'BUI-Cache-v1';
// 匹配到部分url，即可不存缓存
var noCacheUrl = ["hm.baidu.com", "api/"];
// 默认缓存的资源
var cacheUrls = [
    '/index.html',
    '/index.js',
    '/manifest.json',
    '/css/bui.css',
    '/css/style.css',
    '/font/iconfont.eot',
    '/font/iconfont.svg',
    '/font/iconfont.ttf',
    '/font/iconfont.woff',
    '/js/zepto.js',
    '/js/bui.js',
    '/js/global.js',
    '/images/applogo.png',
    '/images/img.svg',
    '/pages/main/main.html',
    '/pages/main/main.js'
];

// 保存缓存的文件
self.addEventListener('install', function (event) {
    // console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                // console.log('Opened cache', cache);
                return cache.addAll(cacheUrls);
            })
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // 外部链接不缓存
    for (let i = 0; i < noCacheUrl.length; i++) {
        let item = noCacheUrl[i];
        if (e.request.url.indexOf(item) > -1) {

            return fetch(e.request).then(function (response) {
                return response;
            });
        }
    }
    // 如果缓存有，则返回缓存内容，如果缓存没有，重新请求，加入到缓存里面
    e.respondWith(
        caches.match(e.request).then(function (r) {
            // console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    // console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});


// 删除缓存
self.addEventListener('activate', function (event) {
    // console.log('activate');
    // 保留缓存的版本，默认为当前版本
    var cacheAllowlist = [cacheName];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    // console.log(cacheName, cacheAllowlist.indexOf(cacheName))
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // 立即激活
    event.waitUntil(self.clients.claim())
});

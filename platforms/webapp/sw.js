var cacheStorageKey='buiapp-v1';

var cacheList=[
  'index.html',
  'index.js',
  'manifest.json',
  'pages/main/main.html',
  'pages/main/main.js',
  'css/bui.css',
  'css/style.css',
  'js/zepto.js',
  'js/bui.js',
  'images/appicon/icon-512.png',
  'images/appicon/icon-168.png',
  'images/applogo.png',
  'font/iconfont.eot',
  'font/iconfont.svg',
  'font/iconfont.ttf',
  'font/iconfont.woff'
]
self.addEventListener('install',e =>{  // install 事件，它发生在浏览器安装并注册 Service Worker 时       
  // e.waitUtil 用于在安装成功之前执行一些预装逻辑
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response != null){
        return response
      }
      return fetch(e.request.url)
    })
  )
})
self.addEventListener('activated', function (e) {
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})
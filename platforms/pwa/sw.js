/** 
 * BUI sw.js 
 * Description: 
 * Register service worker. 
 **/

const CACHE_NAME="buiapp-1.0";

// 
self.addEventListener('install', function (event) {
  
  let url_list=[
      './',
    'css/style.css',
    'css/bui.css',
    'font/iconfont.eot',
    'font/iconfont.ttf',
    'font/iconfont.svg',
    'font/iconfont.woff',
    'js/zepto.js',
    'js/bui.js',
    'index.html',
    'index.js',
    'pages/main/main.html',
    'pages/main/main.js',
  ];

  // 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        consloe.log("缓存打开成功");
        cache.addAll(url_list).then(function(){
            consloe.log("所有资源都已获取并缓存");
        });
      }).catch(function(error) {
          console.log('缓存打开失败:', error);
        })
  );
  
});

//监听浏览器的所有fetch请求，对已经缓存的资源使用本地缓存回复
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          //该fetch请求已经缓存
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });

  function deleteObsoleteCache() {
    return caches.keys().then(function (keys) {
        var all = keys.map(function (key) {
            if (key.indexOf(CACHE_PREFIX) !== -1 && key.indexOf(CACHE_VERSION) === -1){
                  console.log('[SW]: Delete cache:' + key);
                  return caches.delete(key);
            }
        });
        return Promise.all(all);
    });
}

// 只代理白名单
var allAssets = [
    '//your.cdn.com/app.css',
    '//your.cdn.com/common.js',
    '//your.cdn.com/index.js'
  ];
  
  //白名单匹配策略
  function matchAssets(requestUrl) {
      var urlObj = new URL(requestUrl);
      var noProtocolUrl = urlObj.href.substr(urlObj.protocol.length);
      if (allAssets.indexOf(noProtocolUrl) !== -1) {
          return true;
      }
      return false;
  }
  
  //监听fetch事件，并只代理白名单中的GET网络请求
  self.addEventListener('fetch', function (event) {
      try{
          var requestUrl = event.request.url;
          var isGET = event.request.method === 'GET';
          var assetMatches = matchAssets(requestUrl);
          if (!assetMatches || !isGET) {
              return;
          }
          var resource = cacheFirstResponse(event);
          event.respondWith(resource);
      }catch(ex){
          console.error('[SW]: handle fetch event error, fallback');
          return;
      }
  });

//初始化请求参数，添加跨域头
var fetchInitParam = {
    mode: 'cors'
};


function fetchCros(request) {
    //add cros header
    return fetch(request.url, fetchInitParam);
}

fetchCros(request).then(function (response) {
    //严格判断缓存是否成功
    if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
      console.log('[SW]: URL [' + request.url + '] from network');
      cache.put(event.request, response.clone());
    } else {
      console.log('[SW]: URL [' + event.request.url + '] wrong response: [' + response.status + '] ' + response.type);
    }
    return response;
  });

// The Util Function to hack URLs of intercepted requests
// const getFixedUrl = (req) => {
//     var now = Date.now()
//     var url = new URL(req.url)

//     // 1. fixed http URL
//     // Just keep syncing with location.protocol
//     // fetch(httpURL) belongs to active mixed content.
//     // And fetch(httpRequest) is not supported yet.

//     url.protocol = self.location.protocol

//     // 2. add query for caching-busting.
//     // Github Pages served with Cache-Control: max-age=600
//     // max-age on mutable content is error-prone, with SW life of bugs can even extend.
//     // Until cache mode of Fetch API landed, we have to workaround cache-busting with query string.
//     // Cache-Control-Bug: https://bugs.chromium.org/p/chromium/issues/detail?id=453190
//     if (url.hostname === self.location.hostname) {
//         url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
//     }

//     return url.href
// }

// /**
//  *  @Lifecycle Activate
//  *  New one activated when old isnt being used.
//  *
//  *  waitUntil(): activating ====> activated
//  */
//  self.addEventListener('activate', event => {
//     console.log("activate")
//     event.waitUntil(self.clients.claim())
// })

// /**
//  *  @Functional Fetch
//  *  All network requests are being intercepted here.
//  *
//  *  void respondWith(Promise<Response> r)
//  */
// self.addEventListener('fetch', event => {

//     // console.log("fetch",event)
//     // Skip some of cross-origin requests, like those for Google Analytics.
//     if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname)>-1) {
        
//         // Stale-while-revalidate
//         // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
//         // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
//         const cached = caches.match(event.request)
//         const fixedUrl = getFixedUrl(event.request)
//         const fetched = fetch(fixedUrl, { cache: 'no-store' })
//         const fetchedCopy = fetched.then(resp => resp.clone())

//         console.log(cached,fixedUrl)

//         // Call respondWith() with whatever we get first.
//         // If the fetch fails (e.g disconnected), wait for the cache.
//         // If there’s nothing in cache, wait for the fetch.
//         // If neither yields a response, return offline pages.
//         event.respondWith(
//             Promise.race([fetched.catch(_ => cached), cached])
//             .then(resp => resp || fetched)
//             .catch(_ => { /* eat any errors */ })
//         )

//         // Update the cache with the version we fetched (only for ok status)
//         event.waitUntil(
//             Promise.all([fetchedCopy, caches.open(RUNTIME)])
//             .then(([response, cache]) => response.ok && cache.put(event.request, response))
//             .catch(_ => { /* eat any errors */ })
//         )
//     }
// })
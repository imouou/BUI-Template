// 全局配置servicework 方法
loader.global(function (global) {
    /** 
     * 离线 pwa 的处理 
     */

    var pageview={
        register: function () {
            // Registering Service Worker sw.js负责缓存文件
            if(typeof navigator.serviceWorker !== 'undefined') {
                navigator.serviceWorker.register('sw.js');
            };
        },
        getPermissionNotification: function (callback) {
            var that=this;
            // 获取通知授权
            Notification.requestPermission().then(function (result) {
                if(result === 'granted') {
                    // pageview.notification({title:"",content:""});
                    callback&&callback();
                }
            });
        },
        notification: function (opt) {
            opt=opt||{};
            // 消息通知
            var title = opt.title || "您有新的通知."
            var notifBody = opt.content || 'Created by buiapp.';
            var notifImg = opt.icon || 'images/applogo.png';
            var options = {
                body: notifBody,
                icon: notifImg
            }
            var notif = new Notification(title, options);
            // setTimeout(randomNotification, 30000);
        },
        loadImg: function (image) {
            // 加载图片
            image.setAttribute('src', image.getAttribute('data-src'));
            image.onload = function() {
                image.removeAttribute('data-src');
            };
        },
        loadImgs: function () {
            // 加载多图资源
            var imagesToLoad = document.querySelectorAll('img[data-src]');
            var that=this;
            if('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function(items, observer) {
                    items.forEach(function(item) {
                        if (item.isIntersecting) {
                            // 加载图片
                            that.loadImg(item.target);
                            observer.unobserve(item.target);
                        }
                    });
                });
                imagesToLoad.forEach(function(img) {
                    observer.observe(img);
                });
            }else {
                imagesToLoad.forEach(function(img) {
                    that.loadImg(img);
                });
            }
        }
    }
    return pageview;
})
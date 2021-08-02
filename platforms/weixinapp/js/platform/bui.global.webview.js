/**
 * 小程序下webview能使用的方法
 */
loader.global(function(global){

// webview操作小程序路由的方法
/*-------------------------------*/
    /**
     * 是否在微信小程序里面
     * @method isMiniProgram 
     * @returns {boolean} []
     * @example
     * 
     * let isMini = global.webview.isMiniProgram();
     * // true || false
     */
    function isMiniProgram(){
        // 检测是否在小程序里面
        return window.__wxjs_environment === 'miniprogram';
    }

    /**
     * 获取小程序环境，貌似无效
     * @method getEnv 
     * @param {function} calback [ 回调 ]
     * @returns {boolean} []
     * @example
     * 
     * global.webview.getEnv(function(res){
     *  // console.log(res)
     * })
     */
    function getEnv(callback){

        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('micromessenger') == -1) {//不在微信或者小程序中
            callback && callback(false);
        } else {
            var isMini = isMiniProgram();
            callback && callback(isMini);
        }

        return this;
    }

    /** 
     * webview跳转到小程序页面,但不支持跳到TAB页面
     * api: https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
     * @method navigateTo 
     * @param {object|string} option [ 支持对象，或者直接传url字符串 ]
     * @param {string} option.url [ 跳转的小程序页面地址，支持问号后面传参数 ]
     * @param {string} option.events [ 页面间通信接口，用于监听被打开页面发送到当前页面的数据。基础库 2.7.3 开始支持。]
     * @param {function} option.success [ 接口调用成功的回调函数 ]
     * @param {function} option.fail [ 接口调用失败的回调函数 ]
     * @param {function} option.complete [ 接口调用结束的回调函数（调用成功、失败都会执行） ]
     * @example 
     * 
     * // 示例1:
     * global.webview.navigateTo('/pages/webapp/index?id=1');
     * 
     * // 示例2: 
     * global.webview.navigateTo({
            url: '/pages/webapp/index?id=1',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function(data) {
                console.log(data)
                },
                someEvent: function(data) {
                console.log(data)
                }
                ...
            },
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
            },
            fail: function(res) {
                // 接口调用失败的回调函数
            },
            complete: function(res) {
                // 接口调用结束的回调函数（调用成功、失败都会执行）
            }
        })
    */
    function navigateTo(opt){
        // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
        
        // let newurl = bui.setUrlParams(opt.url,opt.param);

        if( opt && bui.typeof(opt) === "object" && opt.url){
            wx.miniProgram.navigateTo(opt);
        }else if(typeof opt === "string"){
            wx.miniProgram.navigateTo({url: opt})
        }

        return this;
    }
    /** 
     * 关闭所有小程序页面, 重新打开指定页面
     * api: https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html
     * @method reLaunch 
     * @param {object|string} option [ 支持对象，或者直接传url字符串 ]
     * @param {string} option.url [ 跳转的小程序页面地址，支持问号后面传参数 ]
     * @param {function} option.success [ 接口调用成功的回调函数 ]
     * @param {function} option.fail [ 接口调用失败的回调函数 ]
     * @param {function} option.complete [ 接口调用结束的回调函数（调用成功、失败都会执行） ]
     * @example 
     * 
     * // 示例1:
     * global.webview.reLaunch('/pages/webapp/index?id=1');
     * 
     * // 示例2: 
     * global.webview.reLaunch({
            url: '/pages/webapp/index?id=1',
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
            },
            fail: function(res) {
                // 接口调用失败的回调函数
            },
            complete: function(res) {
                // 接口调用结束的回调函数（调用成功、失败都会执行）
            }
        })
    */
    function reLaunch(opt){
        // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
        
        // let newurl = bui.setUrlParams(opt.url,opt.param);

        if( opt && bui.typeof(opt) === "object" && opt.url){
            wx.miniProgram.reLaunch(opt);
        }else if(typeof opt === "string"){
            wx.miniProgram.reLaunch({url: opt})
        }

        return this;
    }
    /** 
     * 关闭当前小程序页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
     * api: https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html
     * @method redirectTo 
     * @param {object|string} option [ 支持对象，或者直接传url字符串 ]
     * @param {string} option.url [ 跳转的小程序页面地址，支持问号后面传参数 ]
     * @param {function} option.success [ 接口调用成功的回调函数 ]
     * @param {function} option.fail [ 接口调用失败的回调函数 ]
     * @param {function} option.complete [ 接口调用结束的回调函数（调用成功、失败都会执行） ]
     * @example 
     * 
     * // 示例1:
     * global.webview.redirectTo('/pages/webapp/index?id=1');
     * 
     * // 示例2: 
     * global.webview.redirectTo({
            url: '/pages/webapp/index?id=1',
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
            },
            fail: function(res) {
                // 接口调用失败的回调函数
            },
            complete: function(res) {
                // 接口调用结束的回调函数（调用成功、失败都会执行）
            }
        })
    */
    function redirectTo(opt){
        // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
        
        // let newurl = bui.setUrlParams(opt.url,opt.param);

        if( opt && bui.typeof(opt) === "object" && opt.url){
            wx.miniProgram.redirectTo(opt);
        }else if(typeof opt === "string"){
            wx.miniProgram.redirectTo({url: opt})
        }

        return this;
    }

    /** 
     * 关闭当前页面，返回上一页面或多级页面。
     * api: https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html
     * @method navigateBack 
     * @param {object|number} option [ 支持对象 ]
     * @param {string} option.delta [ 返回的页面数，默认1，如果 delta 大于现有页面数，则返回到首页。 ]
     * @param {function} option.success [ 接口调用成功的回调函数 ]
     * @param {function} option.fail [ 接口调用失败的回调函数 ]
     * @param {function} option.complete [ 接口调用结束的回调函数（调用成功、失败都会执行） ]
     * @example 
     * 
     * // 示例1: 返回上一级
     *  global.webview.navigateBack();
     * 
     * // 示例2: 返回两层页面，大于当前到页面栈则回到首页
     *  global.webview.navigateBack({
     *       delta: 2
     *  })
    */

    function navigateBack(opt){
        if( typeof opt === "string" || typeof opt === "number" ){
            wx.miniProgram.navigateBack({delta: opt});
        }else if(opt && bui.typeof(opt) === "object" && opt.delta){
            wx.miniProgram.navigateBack(opt);
        }else{
            wx.miniProgram.navigateBack({delta: 1});
        }
        return this;
    }


    /** 
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面在小程序插件中使用时，只能在当前插件的页面中调用
     * api: https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
     * @method switchTab 
     * @param {object|number} option [ 支持对象 ]
     * @param {string} option.url [ 跳转的小程序页面地址，不支持传参数 ]
     * @param {function} option.success [ 接口调用成功的回调函数 ]
     * @param {function} option.fail [ 接口调用失败的回调函数 ]
     * @param {function} option.complete [ 接口调用结束的回调函数（调用成功、失败都会执行） ]
     * @example 
     * 
     * // 示例1: 返回上一级
     *  global.webview.switchTab("/pages/index/index");
     * 
     * // 示例2: 返回两层页面，大于当前到页面栈则回到首页
     *  global.webview.switchTab({
     *       url: "/pages/index/index"
     *  })
    */

    function switchTab(opt){
        if( typeof opt === "string" ){
            wx.miniProgram.switchTab({url: opt});
        }else if(opt && bui.typeof(opt) === "object" && opt.url){
            wx.miniProgram.switchTab(opt);
        }
        return this;
    }



    /** 
     * 向小程序发送消息，会在特定时机（小程序后退、组件销毁、分享）触发组件的message事件, // 在小程序里面,先触发这个方法,再触发分享,才能在 onLoad 里面接收到webview传的消息
     * @method postMessage 
     * @param {object|string} option [ 支持对象 ]
     * @example 
     * 
     * // 示例1: 传字符串
     *  global.webview.postMessage("foo");
     * 
     * 
     * // 示例2: 传对象, 无需再传 data字段
     *  global.webview.postMessage({foo: "bar"} )
     * 
     * 小程序后退或者分享,会触发页面的 onLoad(e){
     *  // e.detail.data[0]  = {foo:"bar"}
     * }
     * }
    */

     function postMessage(opt){
        
        wx.miniProgram.postMessage({data: opt});

        return this;
    }


    // webview操作小程序图像接口的方法
    /*-------------------------------*/


    return {
        webview:{
            getEnv,
            isMiniProgram,
            navigateTo,
            navigateBack,
            reLaunch,
            switchTab,
            redirectTo,
            postMessage
        }
    }
})
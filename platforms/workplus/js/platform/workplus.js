/*
 * workplus平台专用,兼容Bingotouch,Link常用API,用于轻应用升级,,
 * 部分API还未转换,如 database,sso,dateTimePicker,progress,wheelSelect
 * 2019-11-22
 */
;
(function(window) {
    /**
     插件类，提供数据请求、界面加载、数据持久化、日期控件等接口，提供全局属性。
     @class app
    */
    window.app = window.app || {};

    /**
     页面事件
     @class app.page
    */
    window.app.page = window.app.page || {};
    /*========================page=======================================*/
    /**
     页面dom结构完成后的事件，类似window.onload
      @method app.page.onReady
      @static
      @example
        app.page.onReady=function(){
            app.alert("页面dom结构加载完成");
        }
    */
    app.page.onReady = function() {}
        /**
         页面加载完成后执行的事件，类似$(function(){...})
          @method app.page.onLoad
          @static
          @example
            app.page.onLoad=function(){
                app.alert("页面加载完成");
            }
        */
    app.page.onLoad = function() {}
        /**
        页面遇到脚本错误时候的事件,全局监控的事件,实际上对window.onerror()的封装
        @method app.page.onError
        @static
        @example

        */
    app.page.onError = function(msg, url, line) {
        //这个会全局捕获js报出的错误，生产环境可以禁用掉
        //alert("url:"+url+" msg:"+msg+" line:"+line);
    }

    /* ===========================utils=================================== */
    /**
      工具类
      @class  app.utils
    */
    window.app.utils = window.utils || {};
    /**
      将json字符串转成json对象
      @method app.utils.toJSON
      @static
      @param param {String} JSON字符串
     */
    app.utils.toJSON = function(param) {
            return typeof(param) == "string" ? eval('(' + param + ')') : param;
        }
        /**
          判断是否在PC上
          @method app.utils.isPC
          @static
          @return {boolean} 返回结果 ⇒ true | false
         */
    app.utils.isPC = function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    }

    /* =============================HttpRequest=============================== */
    /**
     @class app
    */
    /**
      Ajax请求数据 workplus没有,使用的是web实现,有跨域问题
      @method app.ajax
      @static
      @param params {JSON对象} 请求参数（参数详情如下）<br/>
                url：网络请求的目标地址<br/>
                data：请求的参数，参数是一个JSON对象<br/>
                method：请求的方法，post或者get，默认是get<br/>
                async：true为异步，false为同步<br/>
                contentType：将数据发到服务器时浏览器使用的编码类型，默认值是"application/x-www-form-urlencoded"<br/>
                headers: http请求头，参数是JSON对象<br/>
                timeout: 超时时间，单位毫秒，默认是10000毫秒<br/>
                success：请求成功时的回调函数<br/>
                fail：请求失败时的回调函数<br/>
      @example
        app.ajax({
            "url":"http://10.201.76.142:8500/dataservice.ashx",
            "data":{type:'news'},
            "async" : true,
            "timeout" :5000,
            "success" : function(res){
                var data = res.returnValue;
                app.alert(data);
            }
        }) ;
        //return
        { name:'yulsh' , sex:'男', age: '25' }
    */
    app.ajax = function(option) {

        //延时处理
        var def = $.Deferred(),
            ajaxHandle = null;
        var config = {
            data: {},
            method: "GET",
            dataType: "json",
            timeout: 60000,
            headers: {},
            processData: true,
            mimeType: "none",
            cache: false,
            async: true,
            needJsonString: true,
            contentType: "",
            localData: null,
            native: true
        }

        //用于option方法的设置参数
        var params = $.extend(true, {}, config, ui.config.ajax, option);
        var paramsSuccess = params.success,
            paramsFail = params.fail || params.error;
        // 如果没传contentType 就根据不同的请求给予默认的参数值
        if (params.contentType === "" && params.method == "GET") {
            params.contentType = "text/html;charset=UTF-8";
        } else if (params.contentType === "" && params.method == "POST") {
            params.contentType = "application/x-www-form-urlencoded";
        } else {
            params.contentType = params.contentType;
        }

        // 尝试转换为字符串, contentType = "application/json" 才能接收
        if (params.contentType == "application/json" && ui.typeof(params.data) === "object" && params.needJsonString) {
            try {
                params.data = JSON.stringify(params.data);
            } catch (e) {
                params.data = params.data;
            }
        }
        if (!params.url) {
            ui.showLog("url不能为空", "app.ajax");
            return def;
        }

        //中断请求
        def.abort = function() {
            ajaxHandle && ajaxHandle.abort();
        };

        // 本地数据
        if (params.localData) {
            paramsSuccess && paramsSuccess(params.localData, 200);
            def.resolve(params.localData, 200);
            return def;
        }


        // web 请求
        function webAjax(params) {

            var successCallback = function(res, status, xhr) {
                var obj;
                if (typeof res == 'string' && params.dataType == "json") {
                    try {
                        obj = JSON.parse(res);
                    } catch (e) {
                        obj = res;
                    }
                } else {
                    obj = res || {};
                }
                paramsSuccess && paramsSuccess(obj, status, xhr);
                def.resolve(obj, status, xhr);
            }
            var failCallback = function(res, status, xhr) {
                // status: "timeout", "error", "abort", "parsererror"
                var obj;
                if (typeof res == 'string' && params.dataType == "json") {
                    try {
                        obj = JSON.parse(res);
                    } catch (e) {
                        obj = res;
                    }
                } else {
                    obj = res || {};
                }
                paramsFail && paramsFail(obj, status, xhr);
                def.reject(obj, status, xhr);
            }

            params.success = successCallback;
            params.error = failCallback;
            // 兼容原本的type参数
            var type = params.type && params.type.toUpperCase();
            params.type = type || params.method.toUpperCase();

            // 普通web请求
            ajaxHandle = $.ajax(params)
        }

        webAjax(params);

        return def;

    };
    /**
    Ajax请求数据，请求wsdl(webservice)
    @method app.ajaxWSDL
    @static
    @param params {JSON对象} 请求参数（参数详情参考示例）<br/>
            method:调用的方法名<br/>
            data:方法参数,json对象<br/>
            namespace:wsdl的命名空间<br/>
            endpoint:wsdl的请求地址<br/>
            timeout:请求超时时间,默认是10000 毫秒<br/>
            success:成功回调，返回数据(字符串)<br/>
            fail:失败回调，返回错误信息(字符串)<br/>
    @example
        var params={
                    method:"getStoreInfo",   //调用的方法
            data:{"storeId":123},   //方法参数，json对象
            namespace:"http://webservice.gmcc.com/",   //wsdl的命名空间
            endpoint:"http://183.232.148.39:7655/fdaims/webservice/FdaimsWebservices",   //wsdl的地址(去掉?wsdl)
            success:function(res){alert(res);},   //成功回调
            fail:function(error){alert(error);}   //失败回调
            };
            app.ajaxWSDL(params);

    */
    app.ajaxWSDL = function(params) {
        params.data = params.data || {};
        params.async = params.async || true;
        params.timeout = params.timeout || 10000;
        Cordova.exec(params.success, params.fail, "HttpRequest", "ajaxWSDL", [params.method, params.data, params.namespace, params.endpoint, params.async, params.timeout]);
    }

    /**
      发送POST请求
      @method app.post
      @static
      @param url {String} 请求地址
      @param data {JSON对象} 请求参数
      @param success {Function} 成功调用函数
      @param fail {Function}  失败调用函数
      @example
        var url="http://10.201.76.142:8500/dataservice.ashx";
        app.post(url,{type:"date"},function(res){
            $("#result").html("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
        },function(res){
            app.alert(res);
        });
        //return
        {"code":"200","returnValue":"2013/9/5 14:14:51"}
    */
    app.post = function(url, data, success, fail) {
            app.ajax({
                "url": url,
                "data": data,
                "method": "POST",
                "contentType": "application/x-www-form-urlencoded",
                "success": success,
                "fail": fail
            });
        }
        /**
          发送GET请求
          @method app.get
          @static
          @param url {String} 请求地址
          @param data {JSON对象} 请求参数
          @param success {Function} 成功调用函数
          @param fail {Function}  失败调用函数
          @example
            var url="http://10.201.76.142:8500/dataservice.ashx?type=date";
            app.get(url,{},function(res){
                $("#result").html("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
            },function(res){
                app.alert(res);
            });
            //return
            {"code":"200","returnValue":"2013/9/5 14:14:51"}
        */
    app.get = function(url, data, success, fail) {
        app.ajax({
            "url": url,
            "data": data,
            "method": "GET",
            "success": success,
            "fail": fail
        });
    }

    /**
      退出程序（<font color="red">android支持退出app，ios下通常不退出，在iOS尽量不要用此接口,在Link中可以通过此接口回到Link应用</font>）
      @method app.exit
      @static
      @example
        app.exit();
     */
    app.exit = function() {
        cordova.exec(function(result) {
                // bui.alert(result);
            },
            function(error) {
                bui.hint("退出失败");
            },
            "WorkPlus_WebView",
            "exit", []
        );
    }

    /**
      检测是否存在某个app workplus没有
      android:传入包名 eg: bingo.touch.debugger
      ios:urlSchemes eg: bingo-debugger://
      @method app.isExist
      @param appId {string} 应用Id
      @param callback {Function} 回调函数
      @return {boolean} 返回结果 ⇒ true | false
      @example
        app.isExist("bingo.touch.debugger",function(res){
            if(res){
                app.alert("存在appId为bingo.touch.debugger的应用!");
            }else{
                app.alert("不存在appId为bingo.touch.debugger应用!")
            }
        });
    */
    app.isExist = function(appId, callback) {
        if (typeof appId == "undefined") {
            app.alert("appId is necessary!");
            return;
        }
        callback = callback || function(result) {
            app.alert(result);
        };
        Cordova.exec(callback, null, "ExtendApp", "isExistApp", [appId]);
    }

    /**
      执行第三方的应用，如果是传入http的远程地址，将会调用系统自带的浏览器打开远程页面
      android: package name eg: bingo.touch.debugger
      ios: urlSchemes eg: http://www.baidu.com open safari
      @method app.run
      @param appId {string} 应用Id
      @param data {JSON对象} 启动参数
      @example
        app.run("bingo.touch.demo",{
            "user" : "yulsh",
            "status" : 1
        });
    */
    app.run = function(appId, data) {
        if (typeof(data) == "undefined" || data == "") {
            data = {};
        }
        if (appId.indexOf("http") > -1) {
            app.openWeb({ url: appId });
            return this;
        }
    }

    /**
      传入http的远程地址，将会调用系统自带的浏览器打开远程页面
      android: package name eg: bingo.touch.debugger
      ios: urlSchemes eg: http://www.baidu.com open safari
      @method app.openWeb
      @param option {JSON对象}
      @param option.url {string} [必须的地址]
      @param option.title {string} [网站标题]
      @param option.fullscreen {boolean} [打开webview全屏,默认 true || false]
      @example
        app.openWeb({url:"http://baidu.com","title":"百度搜索"});
    */
    app.openWeb = function(option) {
        if (typeof option === "object" && !option.url) {
            return;
        }
        cordova.exec(function(result) {
                option.success && option.success(result)
            },
            function(error) {
                option.fail && option.fail(result)
            },
            "WorkPlus_WebView",
            "openWebView", [{
                "url": option.url,
                "title": option.title || "",
                "use_android_webview": true, //是否使用 android 原生 webview 打开, 否则使用workplus 订制的 webview
                "display_mode": option.fullscreen === false ? "" : "FULL_SCREEN" //全屏打开 webview(即不包含原生标题栏), 默认非全屏
            }]
        );
    }

    // 打开文件:如office文件，会自动识别MIME类型
    // filePath:document path
    // mime: mime type
    /**
      打开文件:如office文件
      @method app.openFile
      @param filePath {String} 文件地址
      @param mime {String} mime类型
      @param success {Function} 打开成功回调
      @param fail {Function} 打开失败回调
      @example
        app.openFile("file:///mnt/sdcard/bingotouch.docx","docx",function(res){
            app.hint("打开成功!");
        });
    */
    app.openFile = function(filePath, mime, success, fail) {
        filePath = filePath || "";
        mime = mime || "";
        success = success || function(result) {};
        fail = fail || function(result) {
            app.hint("没有找到合适的程序打开该文件");
        };

        cordova.exec(function(result) {
                success && success(result)
            },
            function(error) {
                fail && fail(error)
            },
            "WorkPlus_Files",
            "readFile", [{
                "path": filePath
            }]
        );
    }


    /**
      获取app安装后的相关目录
      @method app.getAppDirectoryEntry
      @param callback {Function} 回调函数
      @example
        //android和ios的目录结构不同
        //android下可以存储在 /sdcard/download下面
        //ios只能存储在应用里面
        app.getAppDirectoryEntry(function(res){
            //区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
            if(window.devicePlatform=="android"){
                window.savePath=res.sdcard;
            }else if(window.devicePlatform=="iOS"){
                window.savePath=res.documents;
            }
        });
    */
    app.getAppDirectoryEntry = function(callback, fail) {
        // ios android 是否一致?
        cordova.exec(function(result) {
                var res = {};
                // android
                res.sdcard = result;
                // ios
                res.documents = result;
                callback && callback(res)
            },
            function(error) {
                fail && fail(error)
            },
            "WorkPlus_Files",
            "getUserFilePath", [{ "system": "file" }]
        );
    }



    /**
      加载一个新的页面
      @method app.load
      @static
      @param params {JSON对象} 请求参数，详情如下<br/>
                url：切换页面的url<br/>
                params：页面传递的参数，一个JSON对象<br/>
                slideType：页面切换的方向<br/>
                progress:(3.0以上版本已弃用该参数)页面间切换时的提示窗口，有三个属性，分别是show、title、message<br/>
                        &nbsp;&nbsp;show：为true时，切换页面时显示提示窗口，为false时无提示窗口<br/>
                        &nbsp;&nbsp;title：提示窗口的标题<br/>
                        &nbsp;&nbsp;message：提示窗口的提示信息<br/>
      @example
        app.load({
            url:"http://www.baidu.com",
            params:{name:"lufeng", sex:"男"},
            slideType:"left",
            progress:{show:"false", title:"your title", message:"your message"}
        });
    */
    app.load = function(option) {
        var config = {
            url: "",
            param: {},
            reload: false,
            replace: false,
            native: true
        }

        var params = $.extend(true, {}, config, option),
            newurl;
        var url = params.url;
        if (!params.url) {
            ui.showLog("url 不能为空!", "bui.load:web");
            return;
        }

        // 使用外部打开
        if (url.indexOf("tel:") >= 0 || url.indexOf("mailto:") >= 0 || url.indexOf("sms:") >= 0) {
            bui.unit.openExtral(url);
            return;
        }

        try {
            params.param = typeof params.param === "string" && JSON.parse(params.param) || params.param || {};
        } catch (e) {
            bui.showLog("param 参数值必须是一个{}对象", "bui.load:web")
            return;
        }

        // 取消手机的键盘,防止键盘占位
        document.activeElement.blur();

        // 生成一个新的url地址
        newurl = bui.setUrlParams(params.url, params.param);

        // 重新加载,跟是否单页无关, 用于单页应用跟单页应用之间的跳转
        if (params.reload && ui.isWebapp) {
            window.location.href = newurl;
            return;
        }
        // 采用替换的方式
        if (params.replace && !("load" in window.router)) {
            window.location.replace(newurl);
            return;
        }
        window.location.href = newurl;
    }


    /**
      加载一个新的页面 workplus没有
      @method app.loadWithUrl
      @static
      @param url {String} 切换页面的url
      @param params {JSON对象} 页面传递的参数
      @param slideType {String} 页面切换的方向
      @param progress {JSON对象} (3.0以上版本已弃用该参数)页面间切换时的提示窗口，有三个属性，分别是show、title、message<br/>
            show：为true时，切换页面时显示提示窗口，为false时无提示窗口<br/>
            title：提示窗口的标题<br/>
            message：提示窗口的提示信息
      @example
        app.loadWithUrl('modules/test/secondpage.html',{},'left',{show:"true", title:"我是切换窗口", message:"正在切换中，别着急..."});
    */
    app.loadWithUrl = function(url, params, slideType, progress) {
            if (typeof(url) == "undefined") {
                app.alert("url is necessary!");
                return;
            }
            params = params || {};
            slideType = slideType || "left"
            var obj = {
                url: url,
                params: params,
                slideType: slideType,
                progress: progress
            };
            app.load(obj);
        }
        /**
          控制屏幕旋转
          @method app.rotation
          @static
          @param type {string} landscape表示横屏锁定、portrait表示竖屏锁定
          @example
            app.rotation("landscape"); //表示当前页面需要横屏锁定显示；
            app.rotation("portrait"); //表示竖屏锁定
            app.rotation("user");  //解除锁定，恢复横竖屏(仅android)。

        */
    app.rotation = function(type) {
        var isLandscape = type === "landscape" ? true : false;
        var isPortrait = type === "portrait" ? true : false;
        var isLand = isLandscape || !isPortrait ? true : false;
        var isLock = type === "user" ? false : true;
        cordova.exec(function(result) {
                // bui.alert(result);
            },
            function(error) {
                bui.hint("调用失败");
            },
            "WorkPlus_WebView",
            "changeOrientation", [{ "landscape": isLand, "lock": isLock }]
        );
    }

    /**
      获取页面传递的参数
      @method app.getPageParams
      @static
      @param callback {Function} 回调函数，注意这个回调函数是有返回结果的
      @example
        app.getPageParams(function(result){
            var name = result.name;
            //……
        });
    */
    app.getPageParams = function(callback) {
        var param = bui.getUrlParams();
        callback && callback(param);
    }

    /**
      返回上个页面，返回的时候可以在上个页面执行相关逻辑
      @method app.back
      @static
      @param callback {Function} 回调函数，可以是一个方法签名,也可以是匿名函数
      @example
        //传入方法签名
        app.back("test('abc')"); //需要在上个页面声明test(a)方法
        app.back(function(){ $(".span>h1").text("BingoTouch");}); //执行匿名函数
    */
    app.back = function(callback) {

        callback && callback();
        window.history.back();
    }

    /**
      刷新当前页面
      @method app.refresh
      @static
      @example
        app.refresh();
    */
    app.refresh = function() {
        window.location.reload(true);
    }

    /**
      获取当前页面的地址
      @method app.getCurrentUri
      @static
      @param callback {Function} 回调函数
      @example
        app.getCurrentUri(function(res){
            $("#result").html("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
        });
    */
    app.getCurrentUri = function(callback) {
        return window.location.href
    }


    /**
     获取当前坐标
     @method app.getLocation
     @static
     @param success {Function} 成功回调函数,返回json对象
     @param fail {Function} 失败回调函数，返回错误信息
	 {
	     "latitude": "xxxx",
	     "longitude":"xxx",
	     "address" : "广州市天河区 xxx 街道 xxx"  //具体地址信息,
	     "city" : "xxx", //广州市
	     "district" : "xxx",  //天河区
	     "street" : "xxx",    //翰景路
	     "aoiName" : xxx        //金星大厦
	 }
     */
    app.getLocation = function(success, fail) {
        cordova.exec(function(result) {

                result.locFrom = "baidu";
                result.locType = "network";
                success && success(result);
            },
            function(error) {
                fail && fail(error);
            },
            "WorkPlus_Location",
            "getLocation", []
        );
    }


    /**
      获取app相关信息
      @method app.getInfo
      @static
      @param callback {Function} 回调函数
      @example
        //res包含三个属性，id:程序的id号、versionCode:版本编码、versionName：版本名称
        app.getInfo(function(res){
            app.alert(res);
        });
    */
    app.getInfo = function(callback) {
        // 兼容bingotouch
        cordova.exec(function(result) {
                result.id = result.channel_id;
                result.versionCode = result.product_version;
                result.versionName = result.product_version;

                callback && callback(result);
            },
            function(error) {
                bui.hint("调用设备信息失败");
            },
            "WorkPlus_DeviceInfo",
            "getDeviceInfo", []
        );
    }

    /**
      获取设备的尺寸 workplus没有
      @method app.getSize
      @static
      @param callback {Function} 回调函数
      @example
        //res包含两个属性，height:屏幕的高度、width:屏幕的宽度
        app.getSize(function(res){
            app.alert(res);
        });
    */
    app.getSize = function(callback) {
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "ExtendApp", "getSize", []);
    }

    /**
      弹出提示框
      @method app.alert
      @static
      @param message {String} 窗口消息内容
      @param callback {Function} 回调函数
      @param title {String}  窗口标题
      @param buttonName {String}   按钮名称
      @example
        app.alert("这是一个定制的提示框", function(){
            app.hint("我有一个回调事件");
        }, "温馨提示", "OK");
     */
    app.alert = function(message, callback, title, buttonName) {
        callback = callback || function(res) {};
        title = title || "提示";
        buttonName = (buttonName && [buttonName]) || ["确定"];
        if (typeof(message) == "object") {
            message = JSON.stringify(message);
        }
        bui.confirm({
            content: message,
            callback: callback,
            title: title,
            buttons: buttonName
        });
    }

    /**
      弹出确认框
      @method app.confirm
      @static
      @param message {String} 窗口消息内容
      @param callback {Function} 回调函数
      @param title {String}  窗口标题
      @param buttonNames {String}  按钮组的名称，例："确定,取消"
      @example
        app.confirm("确定要使用BingoTouch吗?", function(index){
            if(index==1){
                app.hint("我点击了OK");
            }else{
                app.hint("我点击了Cancel");
            }
        }, "请您确认", "OK,Cancel");
     */
    app.confirm = function(message, callback, title, buttonNames) {
        callback = callback || function(res) {};
        title = title || "提示";
        buttonNames = buttonNames || "确认,取消";

        bui.confirm({
            content: message,
            callback: callback,
            title: title,
            buttons: buttonNames.indexOf(",") > -1 ? buttonNames.split(",") : [buttonNames]
        })
    }

    /**
     显示提示信息
     @method app.hint
     @param message {string} 提示信息
     @param pasition {string}  提示语位置
     @example
        app.hint("Hello,BingoTouch");
    */
    app.hint = function(message, position) {
            bui.hint({
                content: message,
                position: position
            })
        }
        /**
        设备震动提醒
        @method app.vibrate
        @param mills {int} 毫秒
        */
    app.vibrate = function(mills) {
        navigator.notification.vibrate(mills);
    }

    /**
      workplus没有 安装应用（<font color="red">仅android平台适用,iOS平台是通过plist的方式安装</font>）
      @method app.install
      @param fileUrl {String} 文件路径
      @param success {Function} 安装成功回调
      @param fail {Function} 安装失败回调
      @example
        app.install(fileUrl);
    */
    app.install = function(fileUrl, success, fail) {
        success = success || function(res) {
            app.hint(res);
        };
        fail = fail || function(res) {
            app.hint(res);
        };
        if (window.devicePlatform == "android") {
            Cordova.exec(success, fail, "ExtendApp", "install", [fileUrl]);
        } else if (window.devicePlatform == "iOS") {
            app.alert("iOS platform do not support this api!");
        }
    }

    /**
      设置运行时全局变量
      @method app.setGlobalVariable
      @param key {String} 键
      @param value {String} 值
      @example
        app.setGlobalVariable("globalParam","BingoTouch");
    */
    var globalVariable = bui.storage({ local: false });
    app.setGlobalVariable = function(key, value) {
        globalVariable.set(key, value);
    }

    /**
      获取运行时全局变量
      @method app.getGlobalVariable
      @param key {String} 键
      @param callback {Function} 回调函数
      @example
        app.getGlobalVariable("globalParam",function(res){
            app.alert("返回值类型:"+typeof(res)+"<br/> 结果:"+ JSON.stringify(res));
        });
    */
    app.getGlobalVariable = function(key, callback) {
        var val = globalVariable.get(key, 0);
        callback && callback(val);
    }


    /**
      获取sim卡信息 workplus没有
      @method app.getSimInfo
      @static
      @param
      @example
        //res包含10个属性，deviceId, phoneNumber, operatorName,
             simCountryIso, simSerialNumber, subscriberId, networkType,
             deviceSoftwareVersion, voiceMailAlphaTag, voiceMailNumber
        app.getSimInfo(function(res){
            app.alert(res);
        });
    */
    app.getSimInfo = function(callback) {
        Cordova.exec(callback, null, "ExtendApp", "getSimInfo", []);
    }


    /**
    打开本地通讯录选择通讯录信息 workplus没有
    @method app.openContactSelector
    @static
    @param  callback {Function} 回调函数,返回json数组，包含名称和手机号

    */
    app.openContactSelector = function(callback) {
        Cordova.exec(callback, null, "ContractEx", "getContracts", []);
    }

    /* =============================app settings========================== */
    /**
      持久化配置
      @class app.setting
    */
    window.app.setting = window.app.setting || {};

    /**
      持久化保存配置信息
      @method app.setting.set
      @static
      @param name {String} 键
      @param value {String}  值
      @example
        app.setting.set("name", "lufeng");
        app.setting.set("sex","男");
     */
    // 区分本地数据跟app.setting 的存储,避免误删
    var globalSetting = bui.storage({
        prefix: "setting"
    });
    app.setting.set = function(name, value) {
        if (typeof(name) == "undefined" || typeof(value) == "undefined") {
            app.alert("name and value is necessary!");
            return;
        }
        globalSetting.set(name, value);
    }

    /**
      获取配置信息
      @method app.setting.get
      @static
      @param name {String} 键名称
      @param defaultValue {String}  默认值
      @param callback {Function} 回调函数
      @example
        app.setting.get("name","默认值",function(res){
            app.alert(res);
        });
    */
    app.setting.get = function(name, defaultValue, callback) {
        if (name == "" || typeof name == "undefined") {
            app.alert("name is necessary!");
            return;
        }
        var val = globalSetting.get(name, 0) || defaultValue || "";
        callback && callback(val)
    }

    /**
      删除某配置信息
      @method app.setting.remove
      @static
      @param name {String} 键
      @example
        app.setting.remove("name");
    */
    app.setting.remove = function(name) {
        if (typeof(name) == "undefined") {
            app.alert("name is necessary!");
            return;
        }
        globalSetting.remove(name);
    }

    /**
      清除所有配置：慎用
      @method app.setting.clear
      @static
      @example
        app.setting.clear();
     */
    app.setting.clear = function() {
        globalSetting.clear();
    }

    /**
      获取所有配置信息
      @method app.setting.getAll
      @static
      @param callback {Function} 回调函数
      @example
        app.setting.getAll(function(res){
            app.alert(res);
        });
     */
    app.setting.getAll = function(callback) {
        // 取到所有setting相关的存储,并返回第一条数据,即所存即所得
        var val = globalSetting.getAll(0);
        callback && callback(val);
    }

    /* =============================app progress========================== */
    /**
      进度条提示
      @class app.progress
    */
    window.app.progress = window.app.progress || {};

    /**
      显示进度条 workplus没有
      @method app.progress.start
      @static
      @param title {String} 标题
      @param message {String}  消息内容
      @example
        app.progress.start("温馨提示","加载中...");
     */

    app.progress.start = function(title, message) {
        title = title || "";
        message = message || "";
        Cordova.exec(null, null, "ExtendApp", "progressStart", [title, message]);
    }

    /**
      停止进度条 workplus没有
      @method app.progress.stop
      @static
      @example
        app.progress.stop();
     */
    app.progress.stop = function() {
        Cordova.exec(null, null, "ExtendApp", "progressStop", []);
    }

    /* ==============================dateTimePicker============================ */
    /**
       日期时间时间选择控件 workplus没有
       @class app.dateTimePicker
    */
    window.app.dateTimePicker = window.app.dateTimePicker || {};

    /**
      选择日期，android下适用,ios下请用滚轮选择
      @method app.dateTimePicker.selectDate
      @static
      @param callback {Function} 回调函数
      @param defaultDate {JSON对象} 默认日期，默认是今天的年月日
      @param format {String}  返回日期格式
      @example
        app.dateTimePicker.selectDate (function(res){
            app.alert("您选择了:"+JSON.stringify(res));
        }, null, "yyyy MM dd");
     */
    app.dateTimePicker.selectDate = function(callback, defaultDate, format) {
        var toDate = new Date();
        defaultDate = defaultDate || {
            "year": toDate.getFullYear(),
            "month": toDate.getMonth() + 1,
            "day": toDate.getDate()
        };
        format = format || "yyyy-MM-dd";
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        if (window.devicePlatform == "android") {
            Cordova.exec(success, null, "DateTimePicker", "date", [defaultDate, format]);
        } else if (window.devicePlatform == "iOS") {
            app.dateTimePicker.wheelSelectDate(callback, defaultDate, format);
        }
    };

    /**
      选择时间，android下适用,ios下请用滚轮选择 workplus没有
      @method app.dateTimePicker.selectTime
      @static
      @param callback {Function} 回调函数
      @param defaultTime {JSON对象} 默认弹出的时间
      @param format {String}  返回时间格式
      @param is24Hours {String}  是否是24小时制，默认是true
      @example
        app.dateTimePicker.selectTime (function(res){
            app.alert("您选择了:"+JSON.stringify(res));
        }, null, "hh mm", true);
    */
    app.dateTimePicker.selectTime = function(callback, defaultTime, format,
        is24Hours) {
        var toDate = new Date();
        defaultTime = defaultTime || {
            "hour": toDate.getHours(),
            "minute": toDate.getMinutes()
        };
        format = format || "hh:mm";
        is24Hours = is24Hours || true;
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        if (window.devicePlatform == "android") {
            Cordova.exec(success, null, "DateTimePicker", "time", [
                defaultTime, format, is24Hours
            ]);
        } else if (window.devicePlatform == "iOS") {
            app.dateTimePicker.wheelSelectTime(callback, defaultTime, format, is24Hours);
        }
    };

    /**
      滚轮选择日期 workplus没有
      @method app.dateTimePicker.wheelSelectDate
      @static
      @param callback {Function} 回调函数
      @param defaultDate {JSON对象} 默认日期，默认是今天的年月日
      @param format {String}  日期格式，默认是"yyyy-MM-dd"
      @param range {JSON对象}  年份的范围，格式如{ "minYear": 2000, "maxYear": 2046 }
      @param isFormat {String} 是否支持格式化，例如只选择年月等。默认是false，format在设置true的时候才生效
      @example
        app.dateTimePicker.wheelSelectDate (function(res){
            app.alert("您选择了:"+JSON.stringify(res));
        }, null, null, { "minYear": 1980, "maxYear": 2013 });
     */
    app.dateTimePicker.wheelSelectDate = function(callback, defaultDate,
        format, range, isFormat) {
        var toDate = new Date();
        defaultDate = defaultDate || {
            "year": toDate.getFullYear(),
            "month": toDate.getMonth() + 1,
            "day": toDate.getDate()
        };
        format = format || "yyyy-MM-dd";
        range = range || {
            "minYear": 2000,
            "maxYear": 2046
        };
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        defaultDate.month = defaultDate.month - 1;
        //ios下重构了日期滚轮控件，这里是兼容处理
        isFormat = isFormat || false;
        if (isFormat && window.devicePlatform == "iOS") {
            defaultDate.month = defaultDate.month + 1;
            Cordova.exec(success, null, "WheelSelectPluginFormat", "date", [defaultDate, format, range]);
        } else {
            Cordova.exec(success, null, "WheelSelectPlugin", "date", [defaultDate, format, range]);
        }
    }

    /**
      滚轮选择时间 workplus没有
      @method app.dateTimePicker.wheelSelectTime
      @static
      @param callback {Function} 回调函数
      @param defaultTime {JSON对象} 默认弹出的时间
      @param format {String}  返回时间格式
      @param is24Hours {String}  是否是24小时制，默认是true
      @example
        app.dateTimePicker.wheelSelectTime (function(res){
            app.alert("您选择了:"+JSON.stringify(res));
        }, null, null, false);
    */
    app.dateTimePicker.wheelSelectTime = function(callback, defaultTime,
        format, is24Hours) {
        var toDate = new Date();
        defaultTime = defaultTime || {
            "hour": toDate.getHours(),
            "minute": toDate.getMinutes()
        };
        format = format || "hh:mm";
        is24Hours = is24Hours || true;
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "WheelSelectPlugin", "time", [defaultTime, format, is24Hours]);
    }

    /* ==============================wheelSelect================================== */
    /**
       滚轮选择控件 workplus没有
       @class app.wheelSelect
    */
    window.app.wheelSelect = window.app.wheelSelect || {};
    /**
     滚轮单选
     @method  app.wheelSelect.oneSelect
     @static
     @param data {Array} 被选择数据
     @param callback {Function} 回调函数
     @param selectedKey {String}  默认选中key
     @param title {String} 标题
     @param buttons {JSON对象}  按钮设置
     @example
       HTML:
           <div id="selectOrg" data-role="BTSelect"  ><span>请选择部门</span></div>
       JS:
           $("#selectOrg").click(function(){
               app.wheelSelect.oneSelect( [{key:"o1",value:"平台"},{key:"o2",value:"电信"}], function(res){
                   $("#selectOrg").btselect("val",res, null);
               }, "o1", "选择部门", { "sureBtn": "确定啦", "cancelBtn": "取消啦" } );
           });
    */
    app.wheelSelect.oneSelect = function(data, callback, selectedKey, title,
        buttons) {
        data = data || [];
        title = title || "提示";
        buttons = buttons || {
            "sureBtn": "确定",
            "cancelBtn": "取消"
        };
        selectedKey = selectedKey || "";
        var success = function(result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "WheelSelectPlugin", "oneSelect", [data,
            selectedKey, title, buttons
        ]);
    }

    /* ==============================Phone====================================== */
    /**
       打电话，发短信
       @class app.phone
    */
    window.app.phone = window.app.phone || {};

    /**
     发短信
     @method app.phone.sendSMS
     @param phone {string}  电话号码
     @param message {string} 信息内容
     @example
        app.phone.sendSMS("10086,10000","你好,我要使用BingoTouch");
    */
    app.phone.sendSMS = function(phone, message) {
        bui.unit.sms(phone, message)
    }

    /**
     打电话
     @method app.phone.dial
     @param phone {string}  电话号码
     @example
        app.phone.dial("10086");
    */
    app.phone.dial = function(phone) {
        bui.unit.tel(phone)
    }

    /* ======================================SSO====================================== */
    /**
      sso
      @class app.sso
    */
    window.app.sso = window.app.sso || {};
    // sso登陆
    // param:{credential_type:"password",username:"tony",password:"1",get_spec_secret:"y",get_service_ticket:"y"}
    // credential_type: password or specsecret
    /**
     sso登陆
     @method app.sso.login
     @param params {JSON对象} 登陆信息,具体参数如下<br/>
            credential_type : 登陆方式  ⇒ password 用普通用户密码 | specsecret 应用专用密码<br/>
            username : 用户名<br/>
            password : 密码<br/>
            get_spec_secret : 是否返回 specsecret  ⇒ y | n<br/>
            get_service_ticket : 是否获得serviceticker ⇒ y | n<br/>
     @param success {Function} 成功回调
     @param fail{Function} 失败回调
     @example
        var params = {
            credential_type: "",
            username: "yulsh",
            password: "111111",
            get_spec_secret: "y",
            get_service_ticket: "y"
        };
        app.sso.login(params, function (res) {
            app.alert(res);
        }, function (res) {
            app.alert("error" + res);
        });
    */
    app.sso.login = function(params, success, fail) {
        params = params || {};
        params.credential_type = params.credential_type || "password";
        params.get_spec_secret = params.get_spec_secret == "y" ? true : false;
        params.get_service_ticket = params.get_service_ticket == "y" ? true :
            false;
        var successCallback = function(result) {
            success(app.utils.toJSON(result));
        }
        var failCallback = function(result) {
            fail(app.utils.toJSON(result));
        }
        Cordova.exec(successCallback, failCallback, "SSOPlugin", "login", [params]);
    }

    /**
       sso注销
       @method app.sso.logout
       @param success {Function} 成功回调
       @param fail{Function} 失败回调
       @example
           app.sso.logout(function (res) {
               app.alert(res);
           },function(res){
               app.alert(res);
           });
    */
    app.sso.logout = function(success, fail) {
        success = success || function(response) {};
        fail = fail || function(response) {};
        Cordova.exec(success, fail, "SSOPlugin", "logout", []);
    }

    /**
     判断是否已经登录
     @method app.sso.isLogined
     @param success {Function} 成功回调
     @example
        app.sso.isLogined(function(res){
            if(res=="true"){
                app.alert("您已正常登录!");
            }else{
                app.alert("您尚未登录!");
            }
        });
    */
    app.sso.isLogined = function(success) {
        Cordova.exec(success, null, "SSOPlugin", "isLogined", []);
    }

    /* ==========================Sqlite Database====================== */
    /**
      数据库
      @class app.database
    */
    window.app.database = window.app.database || {};

    /**
     打开数据库，如果不存在会默认创建
        @method app.database.open
        @param name {String} 数据库名称
        @param version {String} 版本
        @param size{Number} 数据大小，单位是 bytes.  1024bytes=1KB 1024KB=1MB
        @example
            var testDatabase = app.database.open("test", "1.0", 1000000);   // 1000000bytes ≈ 1MB
    */
    app.database.open = function(name, version, size) {
        if (name == "" || typeof name == "undefined") {
            app.alert("name is necessary!");
            return null;
        }
        return window.openDatabase(name, version, name, size);
    }

    /**
     执行sql: create,drop,insert,update,delete.
     支持批量
        @method app.database.executeNonQuery
        @param database {Object} open的数据库
        @param sql {String | Array } sql （可单条或批量）
        @param success {Function} 成功回调 PS：成功回调没有result参数
        @param fail{Function} 失败回调
        @example
            app.database.executeNonQuery(testDatabase, [
                'DROP TABLE IF EXISTS DEMO',
                'CREATE TABLE IF NOT EXISTS DEMO (id unique, data)',
                'INSERT INTO DEMO (id, data) VALUES (1, "First row")',
                'INSERT INTO DEMO (id, data) VALUES (2, "Second row")'
            ],function(){
            },function(res){
            });
    */
    app.database.executeNonQuery = function(database, sql, success, fail) {
        success = success || function() {}
        fail = fail || function(error) {
            app.alert(error);
        }
        database.transaction(function(tx) {
            if (typeof sql == "string") {
                tx.executeSql(sql);
            } else if ($.isArray(sql)) {
                for (var i = 0; i < sql.length; i++) {
                    tx.executeSql(sql[i]);
                }
            }
        }, fail, success);
    }

    /**
     执行查询
        @method app.database.executeQuery
        @param database {Object} open的数据库
        @param sql {String} sql
        @param success {Function} 成功回调
        @param fail{Function} 失败回调
        @example
            app.database.executeQuery(testDatabase ,'select * from DEMO',function(tx, results){
            },function(res){
            });
    */
    app.database.executeQuery = function(database, sql, success, fail) {
        success = success || function(tx, results) {
            // results.rows.length
            // results.rowsAffected
            // results.insertId
            // results.rows.item(i).field
        }
        fail = fail || function(error) {
            app.alert(error);
        }
        database.transaction(function(tx) {
            tx.executeSql(sql, [], success, fail);
        }, fail);
    }



    /**
      二维码
      @class app.barcode
    */
    window.app.barcode = window.app.barcode || {};

    /**
        该接口用于调用二维码扫描
        @method app.barcode.scan
        @static
        @param success 成功回调方法
        @param fail 失败回调方法
        @example
            app.barcode.scan(function(result) {
                app.alert(result)
            }, function(result) {
                app.alert(result)
            });
    */
    app.barcode.scan = function(success, fail) {
        cordova.exec(function(result) {
                success && success(result);
            },
            function(error) {
                fail && fail(error);
            },
            "WorkPlus_BarcodeScanner",
            "scanner", []
        );
    }

    /**
      本地通知
      @class app.notification
    */
    window.app.notification = window.app.notification || {};

    /**
        该接口用于发起本地通知 workplus没有
        @method app.notification.notify
        @static
        @param title {String} 标题
        @param body {String} 主要内容
        @param isAutoDisapper {boolean} 是否自动移除
        @param disapperTime {long} X时间后移除
        @param clickAction {String} 点击本地通知回到activity后执行的JS方法
        @param clickActionParams {JsonArray} 方法的参数
        @example
            $("#btnNotification").tap(function() {
                    var params = {
                    "title":"理想",
                    "body":"这是理想！",
                    "isAutoDisappear":true,
                    "disappearTime":5000,
                    "clickAction": "afterNotification",
                    "clickActionParams": {"title":"理想"}
                    };
                app.notification.notify(params);
            });

            afterNotification = function(param){
                alert(param.title);
            }
    */
    app.notification.notify = function(params) {
        params = params || {};
        params.title = params.title || "";
        params.body = params.body || "";
        params.isAutoDisappear = params.isAutoDisappear || true;
        params.disappearTime = params.disappearTime || 5000;
        params.clickAction = params.clickAction || "";
        params.clickActionParams = params.clickActionParams || {};
        Cordova.exec(null, null, "LocalNotification", "notify", [params.title, params.body, params.isAutoDisappear, params.disappearTime, params.clickAction, params.clickActionParams]);
    }


    /**
            社会化分享插件
            @class app.shareplugin
        */
    window.app.shareplugin = window.app.shareplugin || {};

    /**
        该接口用于社会化分享
        @method app.shareplugin.share
        @static
        @param title {String} 标题，邮箱、信息、微信、QQ空间使用
        @param titleUrl {String} 标题的网络链接，仅在QQ空间使用
        @param text {String} 分享文本，所有平台都需要这个字段
        @param url {String} 仅在微信（包括好友和朋友圈）中使用
        @param comment {String} 对这条分享的评论，仅在QQ空间使用
        @param siteName {String} 分享此内容的网站名称，仅在QQ空间使用
        @param siteUrl {String} 分享此内容的网站地址，仅在QQ空间使用
        @example
            var params={
                title:"BingoTouch开发框架",
                titleUrl:"http://www.bingosoft.net",
                text:"欢迎关注BingoTouch!",
                url:"http://www.bingosoft.net",
                comment:"我们一直在完善",
                siteName:"BingoTouch官方网站",
                siteUrl:"http://dev.bingocc.cc:8060/modules/bingotouch/",
            };
            app.shareplugin.share(params);
    */
    app.shareplugin.share = function(params) {
        // cover_media_id 图标ID
        cordova.exec(function(result) {
                params.callback && params.callback(params);
            },
            function(error) {
                bui.hint("调用分享失败");
            },
            "WorkPlus_WebView",
            "share", [{ "url": params.url, "title": params.title, "cover_media_id": params.titleUrl, "scope": 0, "summary": params.text }]
        );
    }



    /**
    运行时定时任务接口 workplus没有
    @class app.timetask
    */
    window.app.timetask = window.app.timetask || {}

    /**
    开启一个定时任务 workplus没有
    @method app.timetask.start
    @static
    @param params {Object} 启动定时任务需要的参数
       id: 定时任务id，id重复不能重复
       taskAction: 定时执行的动作，这里可以是方法名或者匿名方法
       maxCount: 任务最多执行的次数，不传默认1w次
       loopTime: 任务执行间隔时间，单位是毫秒
       isImmediate: 是否立刻执行，默认不立刻执行，loopTime 毫秒后才执行
       callback: 回调函数，返回json对象。如｛id:"",status:"",desc:""｝
    */
    app.timetask.start = function(params) {
        params = params || {};
        params.id = params.id || "";
        params.taskAction = params.taskAction || "";
        params.maxCount = params.maxCount || 10000; //默认执行1w次
        params.loopTime = params.loopTime || 1000; //默认1s 执行一次
        params.isImmediate = params.isImmediate || false; //是否立刻执行

        if (params.id == "") {
            app.alert("任务id不能为空!");
            return;
        }
        if (params.taskAction == "") {
            app.alert("任务动作不能为空!");
            return;
        }
        var nativeCallback = function(result) {
            params.callback(app.utils.toJSON(result));
        }
        Cordova.exec(nativeCallback, null, "TimeTask", "taskStart", [params]);
    }

    /**
    结束一个定时任务 workplus没有
    @method app.timetask.stop
    @static
    @param id {String} 任务id
    @param callback {function} 回调函，数返回json对象。如｛id:"",status:"",desc:""｝
    */
    app.timetask.stop = function(id, callback) {
        id = id || "";
        if (id == "") {
            app.alert("任务id不能为空!");
            return;
        }
        var nativeCallback = function(result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(nativeCallback, null, "TimeTask", "taskStop", [id]);
    }

    /**
     * --------------------------------------------------------
     * 扩展的app方法
     * --------------------------------------------------------
     **/

    /**
      下载文件
    @method app.download
    @static
    @param option {object}
    @param option.url {string} 下载的地址
    @param option.data {object}  下载用到的参数 {headers:""}
    @param option.name {string}  文件名,可不传
    @param option.path {string}  存储的路径, 一般通过 app.getAppDirectoryEntry 结合使用.
    @param option.success {function}  下载成功的回调
    @param option.fail {function}  下载失败的回调

    		例子:
    		app.download({
                // url:"https://appstore.gzmtr.cc:10000/mxm/api/v1/gzdt/oa/download/file?url=http://10.105.183.115/WF_Attachment/2019/11/20191120000007/a4776a8c-cd6d-4b2b-a5ab-db1cb4a96161.docx",
                url:"http://www.easybui.com/demo/images/applogo.png",
                name:"考试大纲4.png",
                success: function (res) {
                  app.openFile(res);
                },
                fail: function () {
                  console.log("fail")
                }
                // mime:"docx"
              })
    */
    app.download = function(option) {
            if (option && !option.url) {
                return;
            }
            // {headers:""}
            var param = option.data || {};

            var fileTransfer = new FileTransfer();
            var uri = encodeURI(option.url);
            var name = option.name || option.url.substr(option.url.lastIndexOf("/"));

            var fileURL = option.path ? (option.path + name) : name; // || "///storage/emulated/0/DCIM/"+name;

            // console.log(fileURL)
            fileTransfer.download(
                uri, fileURL,
                function(entry) {
                    // console.log("download complete: " + entry.toURL());
                    option.success && option.success(fileURL, entry)
                },

                function(error) {
                    // console.log("download error source " + error.source);
                    // console.log("download error target " + error.target);
                    // console.log("download error code" + error.code);
                    option.fail && option.fail(fileURL, error)
                },

                false, param
            );
        }
        /**
          获取文件,找不到则下载
        @method app.getDownload
        @static
        @param option {object}
        @param option.url {string} 下载的地址
        @param option.data {object}  下载用到的参数 {headers:""}
        @param option.name {string}  文件名,可不传
        @param option.mimeType {string}  文件类型 mimeType:"docx"
        @param option.path {string}  存储的路径, 一般通过 app.getAppDirectoryEntry 结合使用.
        @param option.success {function}  下载成功的回调
        @param option.fail {function}  下载失败的回调
        	//例子:
        		app.getDownload({
                    // url:"https://appstore.gzmtr.cc:10000/mxm/api/v1/gzdt/oa/download/file?url=http://10.105.183.115/WF_Attachment/2019/11/20191120000007/a4776a8c-cd6d-4b2b-a5ab-db1cb4a96161.docx",
                    url:"http://www.easybui.com/demo/images/applogo.png",
                    name:"考试大纲4.png",
                    success: function (res) {
                      app.openFile(res);
                    },
                    fail: function () {
                      console.log("fail")
                    }
                    // mime:"docx"
                  })
        */
    app.getDownload = function(option) {
            if (typeof option !== "object") {
                return;
            }
            var name = option.name || option.url.substr(option.url.lastIndexOf("/") + 1);
            var mime = option.mimeType || option.url.substr(option.url.lastIndexOf(".") + 1) || "";
            var success = option && option.success || function() {};
            var fail = option && option.fail || function() {};

            app.getAppDirectoryEntry(function(res) {

                var filepath = res.sdcard + name;

                app.isFileExist(filepath, function(result) {
                    // console.log(result.exist)
                    if (result.exist) {
                        // console.log("exist")
                        app.openFile(filepath, mime, option.success, option.fail);
                    } else {
                        app.download({
                            url: option.url,
                            path: res.sdcard,
                            name: name,
                            success: function() {

                                success && success(filepath, option)
                            },
                            fail: function() {
                                success && success(filepath, option)
                            },
                        })

                    }
                })


            });
        }
        /**
          文件是否存在
        @method app.isFileExist
        @static
        @param option {object}
        请求返回数据：
         {
            "exist" : true //文件是否存在
         }
        */
    app.isFileExist = function(url, success, fail) {
            cordova.exec(function(result) {
                    success && success(result);
                },
                function(error) {
                    fail && fail(error);
                },
                "WorkPlus_Files",
                "isFileExist", [{
                    "path": url
                }]
            );
        }
        /**
	  选择文件,配合上传接口使用
	@method app.getFile
	@static
	@param option {object}
    // 例子
    app.getFile({
      success: function (res) {
        //res = {
        //   "filePath": "文件在本机的路径"
        //}
        app.upload({
          url:"",
          data: {
            file: res
          },
          success: function(){
            // console.log("upload success")
          }
        })
      }
    })
	请求返回数据：
  {
     "filePath": "文件在本机的路径"
  }
	*/
    app.getFile = function(option) {
            option = option || {};
            cordova.exec(function(result) {
                    // alert(JSON.stringify(result, null, 4));
                    option.success && option.success(result);
                },
                function(error) {
                    // alert("调用失败");
                    option.fail && option.fail(error);

                },
                "WorkPlus_Files",
                "selectFile", []
            );
        }
        /**
	  拍照返回文件,配合上传接口使用
	@method app.takePhoto
	@static
	@param option {object}
    // 例子
    app.takePhoto({
      success: function (res) {
        //res = {
        //   "filePath": "文件在本机的路径"
        //}
        app.upload({
          url:"",
          data: {
            file: res
          },
          success: function(){
            // console.log("upload success")
          }
        })
      }
    })
	请求返回数据：
  {
      "imageURL":"压缩后图像存在本地的地址",
      "key":"原图像存在本地的地址",
      "imageInfo": //相对于图像的信息
      {
          "height":"图像高",
          "width":"图像宽",
          "size":"图像大小"
      }
  }
	*/
    app.takePhoto = function(option) {
            option = option || {};
            cordova.exec(function(result) {
                    // alert(JSON.stringify(result, null, 4));
                    option.success && option.success(result);
                },
                function(error) {
                    // alert("调用失败");
                    option.fail && option.fail(error);

                },
                "WorkPlus_Image",
                "takePhoto", []
            );

        }
        /**
	  拍照返回文件,配合上传接口使用
	@method app.selectImage
	@static
	@param option {object}
    // 例子
    app.selectImage({
      success: function (res) {

        app.upload({
          url:"",
          data: {
            file: res.imageURL
          },
          success: function(){
            // console.log("upload success")
          }
        })
      }
    })
	请求返回数据：
  {
      "imageURL":"压缩后图像存在本地的地址",
      "key":"原图像存在本地的地址",
      "imageInfo": //相对于图像的信息
      {
          "height":"图像高",
          "width":"图像宽",
          "size":"图像大小"
      }
  }
	*/
    app.selectImage = function(option) {
            option = option || {};
            cordova.exec(function(result) {
                    // alert(JSON.stringify(result, null, 4));
                    option.success && option.success(result);
                },
                function(error) {
                    // alert("调用失败");
                    option.fail && option.fail(error);

                },
                "WorkPlus_Image",
                "selectImage", []
            );
        }
        /**
	  清除选择拍照后的压缩图片
	@method app.cleanImageCache
	@static
	@param option {object}
    // 例子
    app.selectImage({
      success: function (res) {

        app.upload({
          url:"",
          data: {
            file: res.imageURL
          },
          success: function(){
            // console.log("upload success")
            // 清除上传的文件
            app.cleanImageCache();
          }
        })
      }
    })
	请求返回数据：
  {
      "imageURL":"压缩后图像存在本地的地址",
      "key":"原图像存在本地的地址",
      "imageInfo": //相对于图像的信息
      {
          "height":"图像高",
          "width":"图像宽",
          "size":"图像大小"
      }
  }
	*/
    app.cleanImageCache = function(option) {
            option = option || {};
            cordova.exec(function(result) {
                    // alert(JSON.stringify(result, null, 4));
                    option.success && option.success(result);
                },
                function(error) {
                    // alert("调用失败");
                    option.fail && option.fail(error);

                },
                "WorkPlus_Image",
                "cleanCompressImage", []
            );
        }
        /**
	  文件上传
	@method app.upload
	@static
	@param option {object}
	@param option.data {object} 上传的文件,格式是 {file:"///storage/emulated/0/DCIM/myFile.jpg",params:{}}
	@param option.url {string}  上传的地址
	@param option.name {string}  文件名,可不传
	@param option.headers {object}  请求头,可不传
	@param option.mimeType {string}  根据文件类型来, "image/jpeg" || "image/png" || "text/plain"

    // 例子
    app.upload({
      url:"",
      data: {
        file: res
      },
      success: function(){
        // console.log("upload success")
      }
    })
	*/
    app.upload = function(option) {
            if (typeof option !== "object") {
                return;
            }
            if (!option.url) {
                return;
            }


            var fileURL = option.data.file;
            var uri = option.url //encodeURI(option.url);

            var options = new FileUploadOptions();
            var type = fileURL.substr(fileURL.lastIndexOf(".")); // .jpg 之类的
            options.fileKey = "file";
            options.fileName = option.name || fileURL.substr(fileURL.lastIndexOf('/') + 1) || bui.guid() + type;
            options.mimeType = option.mimeType || "image/jpeg" || "text/plain";
            // 除了文件还要自带一些参数
            options.params = option.data && option.data.paprams || {};

            // var mediaType;
            // // 切换类型
            // switch (param.mediaType) {
            //  case "picture":
            //   mediaType = navigator.camera.MediaType.PICTURE;
            //   break;
            //  case "video":
            //   mediaType = navigator.camera.MediaType.VIDEO;
            //   break;
            //  default:
            //   mediaType = navigator.camera.MediaType.ALLMEDIA;
            //   break;
            // }
            // options.mediaType = mediaType;


            options.headers = option.headers || {};

            var ft = new FileTransfer();

            ft.upload(fileURL, uri, onSuccess, onError, options);

            function onSuccess(r) {
                //    console.log("Code = " + r.responseCode);
                //    console.log("Response = " + r.response);
                //    console.log("Sent = " + r.bytesSent);
                try {
                    var result = JSON.parse(r.response);
                } catch (e) {
                    // console.log(e)
                    result = r.response;
                }
                option.success && option.success(result, r);
            }

            function onError(error) {
                // console.log(555)
                // console.log("An error has occurred: Code = " + error.code);
                // console.log("upload error source " + error.source);
                // console.log("upload error target " + error.target);
                option.fail && option.fail(error);
            }

        }
        /**
         * --------------------------------------------------------
         * Link兼容 API
         * --------------------------------------------------------
         **/

    window.app.link = {};

    /**
     * 包括：获取登录用户信息、获取指定用户信息、获取AccessToken等
     * @class 用户信息
     */

    /**
      * 获取登陆后的用户信息
      * @method getLoginInfo
      * @static
      * @param {function} callback 回调函数，返回登录用户信息
      * @example
    	app.link.getLoginInfo(function(result){
    		app.alert(result);
    	});

    	// 请求返回数据：
    	{
    		loginId: result.username,
    		userId: result.user_id,
    		userName: result.name,
    		picture: result.avatar,
    		picture_local: result.avatar,
    		telephone: result.phone,
    		sCode: result.domain_id,
    		orgId: result.employee.org_code,
    		orgName: result.employee.org_code,
    		email: result.email,
    		postDescription: result.employee.positions,
    		type: result.status,
    		namePinYin: result.employee.pinyin,
    	}
    */
    app.link.getLoginInfo = function(success, fail) {
        cordova.exec(function(result) {
                var res = {
                    loginId: result.username,
                    userId: result.user_id,
                    userName: result.name,
                    picture: result.avatar,
                    picture_local: result.avatar,
                    telephone: result.phone,
                    sCode: result.domain_id,
                    orgId: result.employee.org_code,
                    orgName: result.employee.org_code,
                    email: result.email,
                    postDescription: result.employee.positions,
                    type: result.status,
                    namePinYin: result.employee.pinyin,
                };
                success && success(res, result);
            },
            function(error) {
                fail && fail(error);
            },
            "WorkPlus_Contact",
            "getCurrentUserInfo", []);

    }

    /**
        * 获取登录用户的AccessToken
        * @method getToken
        * @static
        * @param callback {function} 回调函数,返回json对象
        * @example
            app.link.getToken(function (result) {
                 app.alert(result);
            });

    		//请求返回数据：
    		{
    		    "accessToken":"用户登陆的access_token"
    		}
    */
    app.link.getToken = function(success, fail) {

        cordova.exec(function(result) {
                result["accessToken"] = result["access_token"];
                success && success(result);
            },
            function(error) {
                fail && fail(result);
            },
            "WorkPlus_Auth",
            "getAccessToken", []);
    }



})(window);
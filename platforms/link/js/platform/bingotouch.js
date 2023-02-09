; (function (window) {
    // 新版cordoav兼容
    if (!window.devicePlatform) {
        var userAgent = navigator.userAgent.toLowerCase();
        window.devicePlatform = /android/.test(userAgent) ? "android" : "iOS";
    }
    /**
      * 基础功能接口，使用该模块必须先引入Cordova.js提供网络请求、页面切换、数据存储、文件操作、设备操作等通用接口。
      * 更多<a href="http://cordova.apache.org/docs/en/2.6.0/index.html" target="_blank">Cordova</a>接口
      * @namespace app
    */
    window.app = window.app || {};


    /**
     * 页面事件
     * @namespace app.page
    */
    window.app.page = window.app.page || {};

    /**
      * 返回上个页面，返回的时候可以在上个页面执行相关逻辑，适用于多页面
      * @method app.back
      * @param callback {Function} 回调函数，可以是一个方法签名,也可以是匿名函数
      * @example
      * //传入方法签名
      * app.back("test('abc')"); //需要在上个页面声明 test(a)方法
      * app.back(function(){ $(".span>h1").text("BingoTouch");}); //执行匿名函数
    */
    app.back = function (callback) {
        if (typeof callback == "undefined") {
            callback = "";
        }
        if ($.isFunction(callback)) {
            callback = "(" + callback.toString() + ")()";
        }
        Cordova.exec(null, null, "Page", "back", [callback]);
    }

    /**
      * 获取当前页面的地址
      * @method app.getCurrentUri
      * @param callback {Function} 回调函数
      * @example
      * app.getCurrentUri(function(res){
      *     $("#result").html("返回值类型:"+typeof(res)+" 结果:"+ JSON.stringify(res));
      * });
    */
    app.getCurrentUri = function (callback) {
        Cordova.exec(callback, null, "Page", "getCurrentUri", []);
    }

    /**
      * 获取页面传递的参数
      * @method app.getPageParams
      * @static
      * @param callback {Function} 回调函数，注意这个回调函数是有返回结果的
      * @example
      * app.getPageParams(function(result){
      *     var name = result.name;
      * });
    */
    app.getPageParams = function (callback) {
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "Page", "getPageParams", []);
    }

    /**
      * 加载页面
      * @method app.load
      * @param params {Object} 请求参数，详情如下
                url：切换页面的url
                params：页面传递的参数，一个JSON对象
                slideType：页面切换的方向left|right|up|down
      * @example
      * app.load({
      *     url:"http://www.baidu.com",
      *     params:{name:"yulsh", sex:"男"},
      *     slideType:"left"
      * });
    */
    app.load = function (params) {
        if (!params) {
            app.alert("should be object like {url:'http://domain',params:{....}}");
            return;
        }
        if (!params.url) {
            app.alert("url is necessary!");
            return;
        }
        var url = params.url;
        if (url.indexOf("http://") > -1 || url.indexOf("https://") > -1 || url.indexOf("file://") > -1 || url.indexOf("/") == 0) {
            //to do
        } else {
            // 处理相对路径
            var selfUrl = window.location.href;
            var lio = selfUrl.lastIndexOf("/");
            url = selfUrl.substring(0, lio) + "/" + url;
            params.url = url;
        }
        // 如果是pc的话直接执行
        if (app.utils.isPC()) {
            window.location.href = url;
            return;
        }
        Cordova.exec(null, null, "Page", "loadUrl", [params]);
    }

    /**
      * 加载页面
      * @method app.loadWithUrl
      * @param url {String} 切换页面的url
      * @param params {Object} 页面传递的参数
      * @param slideType {String} 页面切换的方向
      * @example
        app.loadWithUrl('modules/test/secondpage.html',{},'left');
    */
    app.loadWithUrl = function (url, params, slideType, progress) {
        if (typeof (url) == "undefined") {
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
      * 刷新当前页面
      * @method app.refresh
      * @example
        app.refresh();
    */
    app.refresh = function () {
        Cordova.exec(null, null, "Page", "refresh", []);
    }

    /**
      * 页面遇到脚本错误时候的事件,全局监控的事件,实际上对window.onerror()的封装
      * @event app.page.onError
      *  @param {String} msg 错误信息
      * @param {String} url 所在页面
      * @param {String} line 所在行数
      * @example
      * app.page.onError=function(msg,url,line){
      *   //这个会全局捕获js报出的错误，生产环境可以禁用掉
      *   //app.hint("url:"+url+" msg:"+msg+" line:"+line);
      * }
    */
    app.page.onError = function (msg, url, line) {
        //todo 默认不实现，可在外面覆盖
    }

    /**
      * 页面dom结构加载完成后的事件，类似window.onload
      * @event app.page.onLoad
      * @example
      * app.page.onLoad=function(){
      *  app.hint("页面加载完成");
        }
    */
    app.page.onLoad = function () { }

    /**
      * 页面dom结构加载完成后的事件，类似zepto.js 的 $(function(){...})
      * @event app.page.onReady
      * @example
      * app.page.onReady=function(){
      *     app.hint("页面dom结构加载完成");
      * }

    */
    app.page.onReady = function () { }

    /**
      * 发送网络请求
      * @method app.ajax
      * @param params {Object}
            url：网络请求地址
            data：请求的参数，JSON对象
            method：请求的方法，post|get，默认是get
            async：true|false(默认)
            contentType：将数据发到服务器时浏览器使用的编码类型，默认值是"application/x-www-form-urlencoded"
            headers: http请求头，JSON对象
            timeout: 超时时间，单位ms，默认10000毫秒
            success：请求成功时的回调函数
            fail：请求失败时的回调函数
      * @example
      * app.ajax({
      *     "url":"http://10.201.76.142:8500/dataservice.ashx",
      *     "data":{type:'news'},
      *     "timeout" :5000,
      *     "success" : function(res){
      *         var data = res.returnValue;
      *         app.alert(data);
      *     }
      * }) ;
      * //return
      * { name:'yulsh' , sex:'男', age: '25' }
    */
    app.ajax = function (params) {
        params = params || {};
        params.data = app.utils.toJSON(params.data);
        params.method = params.method || "GET";
        if (typeof (params.async) == "undefined") {
            params.async = true;
        }
        params.contentType = params.contentType || "application/x-www-form-urlencoded";
        params.headers = params.headers || {};
        params.timeout = params.timeout || 10000;
        var successCallback = function (result) {
            params.success(app.utils.toJSON(result));
        };
        var failCallback = function (result) {
            params.fail(app.utils.toJSON(result));
        }

        Cordova.exec(successCallback, failCallback, "HttpRequest", "ajax", [params.url, params.data, params.method, params.async, params.contentType, params.headers, params.timeout]);
    }

    /**
      * 发送网络请求，请求wsdl(webservice)
      * @method app.ajaxWSDL
      * @param params {Object}
            method:调用的方法名
            data:方法参数,json对象
            namespace:wsdl的命名空间
            endpoint:wsdl的请求地址
            timeout:请求超时时间,默认是10000 毫秒
            success:成功回调，返回数据(字符串)
            fail:失败回调，返回错误信息(字符串)
      * @example
      * var params={
      *   method:"getStoreInfo",   //调用的方法
      *   data:{"storeId":123},   //方法参数，json对象
      *   namespace:"http://webservice.gmcc.com/",   //wsdl的命名空间
      *   endpoint:"http://183.232.148.39:7655/fdaims/webservice/FdaimsWebservices",   //wsdl的地址(去掉?wsdl)
      *   success:function(res){alert(res);},   //成功回调
      *   fail:function(error){alert(error);}   //失败回调
      * };
      * app.ajaxWSDL(params);
    */
    app.ajaxWSDL = function (params) {
        params.data = params.data || {};
        params.async = params.async || true;
        params.timeout = params.timeout || 10000;
        Cordova.exec(params.success, params.fail, "HttpRequest", "ajaxWSDL", [params.method, params.data, params.namespace, params.endpoint, params.async, params.timeout]);
    }

    /**
      * 发送GET请求
      * @method app.get
      * @param url {String} 请求地址
      * @param data {Object} 请求参数
      * @param success {Function} 成功调用函数
      * @param fail {Function}  失败调用函数
      * @example
      * var url="http://10.201.76.142:8500/dataservice.ashx?type=date";
      * app.get(url,{},function(res){
      *     $("#result").html("返回值类型:"+typeof(res)+" 结果:"+ JSON.stringify(res));
      * },function(res){
      *     app.alert(res);
      * });
      * //return
      * {"code":"200","returnValue":"2013/9/5 14:14:51"}
    */
    app.get = function (url, data, success, fail) {
        app.ajax({
            "url": url,
            "data": data,
            "method": "GET",
            "success": success,
            "fail": fail
        });
    }

    /**
      *  发送POST请求
      *  @method app.post
      *  @param url {String} 请求地址
      *  @param data {Object} JSON对象，请求参数
      *  @param success {Function} 成功调用函数
      *  @param fail {Function}  失败调用函数
      *  @example
      *  var url="http://10.201.76.142:8500/dataservice.ashx";
      *  app.post(url,{type:"date"},function(res){
      *      $("#result").html("返回值类型:"+typeof(res)+" 结果:"+ JSON.stringify(res));
      *  },function(res){
      *      app.alert(res);
      *  });
      *  //return
      *  {"code":"200","returnValue":"2013/9/5 14:14:51"}
    */
    app.post = function (url, data, success, fail) {
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
      * 弹出提示框
      * @method app.alert
      * @param message {String} 窗口消息内容
      * @param callback {Function} 回调函数
      * @param title {String}  窗口标题
      * @param buttonName {String}   按钮名称
      * @example
      * app.alert("这是一个定制的提示框", function(){
      *     app.hint("我有一个回调事件");
      * }, "温馨提示", "OK");
     */
    app.alert = function (message, callback, title, buttonName) {
        callback = callback || function (res) { };
        title = title || "提示";
        buttonName = buttonName || "确定";
        if (typeof (message) == "object") {
            message = JSON.stringify(message);
        }
        navigator.notification.alert(message, callback, title, buttonName);
    }

    /**
      * 弹出确认框
      * @method app.confirm
      * @param message {String} 窗口消息内容
      * @param callback {Function} 回调函数
      * @param title {String}  窗口标题
      * @param buttonNames {String}  按钮组的名称，例："确定,取消"
      * @example
      * app.confirm("确定要使用BingoTouch吗?", function(index){
      *     if(index==1){
      *         app.hint("我点击了OK");
      *     }else{
      *         app.hint("我点击了Cancel");
      *     }
      * }, "请您确认", "OK,Cancel");
     */
    app.confirm = function (message, callback, title, buttonNames) {
        callback = callback || function (res) { };
        title = title || "提示";
        buttonNames = buttonNames || "确认,取消";
        navigator.notification.confirm(message, callback, title, buttonNames);
    }

    /**
      *  显示提示信息
      *  @method app.hint
      *  @param message {String} 提示信息
      *  @param pasition {String}  提示语位置 top|bottom(default)
      *  @example
        app.hint("Hello,World");
    */
    app.hint = function (message, position) {
        message = message || "";
        position = position || "bottom";
        Cordova.exec(null, null, "ExtendApp", "hint", [message, position]);
    }

    /**
      * 进度提醒，原生UI效果：加载中进度条
      * @namespace app.progress
     */
    window.app.progress = window.app.progress || {};

    /**
      *   显示进度条
      *   @method app.progress.start
      *   @param title {String} 标题
      *   @param message {String}  消息内容
      *   @example
          app.progress.start("温馨提示","加载中...");
     */
    app.progress.start = function (title, message) {
        title = title || "";
        message = message || "";
        Cordova.exec(null, null, "ExtendApp", "progressStart", [title, message]);
    }

    /**
      *   停止进度条
      *   @method app.progress.stop
      *   @example
          app.progress.stop();
     */
    app.progress.stop = function () {
        Cordova.exec(null, null, "ExtendApp", "progressStop", []);
    }

    /**
      * 持久化配置，存储持久化配置信息，key-value格式
      * @namespace app.setting
    */
    window.app.setting = window.app.setting || {};

    /**
      *   持久化保存配置信息
      *   @method app.setting.set
      *   @param name {String} 键
      *   @param value {String}  值
      *   @example
          app.setting.set("name", "lufeng");
          app.setting.set("sex","男");
     */
    app.setting.set = function (name, value) {
        if (typeof (name) == "undefined" || typeof (value) == "undefined") {
            app.alert("name and value is necessary!");
            return;
        }
        Cordova.exec(null, null, "Setting", "set", [name, value]);
    }

    /**
      *   获取配置信息
      *   @method app.setting.get
      *   @param name {String} 键名称
      *   @param defaultValue {String}  默认值
      *   @param callback {Function} 回调函数
      *   @example
      *   app.setting.get("name","默认值",function(res){
      *       app.alert(res);
      *   });
    */
    app.setting.get = function (name, defaultValue, callback) {
        if (name == "" || typeof name == "undefined") {
            app.alert("name is necessary!");
            return;
        }
        defaultValue = defaultValue || "";
        callback = callback || function (result) {
            app.alert(result);
        }
        Cordova.exec(callback, null, "Setting", "get", [name, defaultValue]);
    }

    /**
      *   删除某配置信息
      *   @method app.setting.remove
      *   @param name {String} 键
      *   @example
        app.setting.remove("name");
    */
    app.setting.remove = function (name) {
        if (typeof (name) == "undefined") {
            app.alert("name is necessary!");
            return;
        }
        Cordova.exec(null, null, "Setting", "remove", [name]);
    }

    /**
      *   清除所有配置
      *   @method app.setting.clear
      *   @example
        app.setting.clear();
     */
    app.setting.clear = function () {
        Cordova.exec(null, null, "Setting", "clear", []);
    }



    /**
      *   获取所有配置信息
      *   @method app.setting.getAll
      *   @param callback {Function} 回调函数
      *   @example
      *   app.setting.getAll(function(res){
      *       app.alert(res);
      *   });
     */
    app.setting.getAll = function (callback) {
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "Setting", "load", []);
    }

    /**
      *   设置运行时全局变量
      *   @method app.setGlobalVariable
      *   @param key {String} 键
      *   @param value {String} 值
      *   @example
        app.setGlobalVariable("name","yulsh");
    */
    app.setGlobalVariable = function (key, value) {
        Cordova.exec(null, null, "ExtendApp", "setVariable", [key, value]);
    }

    /**
      *   获取运行时全局变量
      *   @method app.getGlobalVariable
      *   @param key {String} 键
      *   @param callback {Function} 回调函数
      *   @example
      *   app.getGlobalVariable("name",function(res){
      *       app.alert("返回值类型:"+typeof(res)+" 结果:"+ JSON.stringify(res));
      *   });
    */
    app.getGlobalVariable = function (key, callback) {
        Cordova.exec(callback, null, "ExtendApp", "getVariable", [key]);
    }


    /**
      * 数据库，SQLite数据库操作，包括创建数据库，执行Sql脚本等
      * @namespace app.database
    */
    window.app.database = window.app.database || {};

    /**
      * 打开数据库，如果不存在会默认创建
      * @method app.database.open
      * @param name {String} 数据库名称
      * @param version {String} 版本
      * @param size{int} 数据大小，单位是 bytes.  1024bytes=1KB 1024KB=1MB
      * @example
        var testDatabase = app.database.open("test", "1.0", 1000000);   // 1000000bytes ≈ 1MB
    */
    app.database.open = function (name, version, size) {
        if (name == "" || typeof name == "undefined") {
            app.alert("name is necessary!");
            return null;
        }
        return window.openDatabase(name, version, name, size);
    }

    /**
      *  执行sql: create,drop,insert,update,delete
      *  @method app.database.executeNonQuery
      *  @param database {Object} open的数据库
      *  @param sql {String | Array } sql （可单条或批量）
      *  @param success {Function} 成功回调 PS：成功回调没有result参数
      *  @param fail{Function} 失败回调
      *  @example
      *  app.database.executeNonQuery(testDatabase, [
      *      'DROP TABLE IF EXISTS DEMO',
      *      'CREATE TABLE IF NOT EXISTS DEMO (id unique, data)',
      *      'INSERT INTO DEMO (id, data) VALUES (1, "First row")',
      *      'INSERT INTO DEMO (id, data) VALUES (2, "Second row")'
      *  ],function(){
      *  },function(res){
      *  });
    */
    app.database.executeNonQuery = function (database, sql, success, fail) {
        success = success || function () {
        }
        fail = fail || function (error) {
            app.alert(error);
        }
        database.transaction(function (tx) {
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
      *  执行查询
      *  @method app.database.executeQuery
      *  @param database {Object} open的数据库
      *  @param sql {String} sql
      *  @param success {Function} 成功回调
      *  @param fail{Function} 失败回调
      *  @example
      *  app.database.executeQuery(testDatabase ,'select * from DEMO',function(tx, results){
      *      // results.rows.length
      *      // results.rowsAffected
      *      // results.insertId
      *      // results.rows.item(i).field
      *  },function(res){
      *  });
    */
    app.database.executeQuery = function (database, sql, success, fail) {
        success = success || function (tx, results) {

        }
        fail = fail || function (error) {
            app.alert(error);
        }
        database.transaction(function (tx) {
            tx.executeSql(sql, [], success, fail);
        }, fail);
    }



    /**
      *   日期时间，原生UI效果：日期／时间选择控件
      *   @namespace app.dateTimePicker
    */
    window.app.dateTimePicker = window.app.dateTimePicker || {};

    /**
      *   选择日期
      *   @method app.dateTimePicker.selectDate
      *   @param callback {Function} 回调函数
      *   @param defaultDate {Object} 默认日期，默认是今天的年月日
      *   @param format {String}  返回日期格式
      *   @example
      *   app.dateTimePicker.selectDate (function(res){
      *       app.alert("您选择了:"+JSON.stringify(res));
      *   }, null, "yyyy MM dd");
     */
    app.dateTimePicker.selectDate = function (callback, defaultDate, format) {
        var toDate = new Date();
        defaultDate = defaultDate || {
            "year": toDate.getFullYear(),
            "month": toDate.getMonth() + 1,
            "day": toDate.getDate()
        };
        format = format || "yyyy-MM-dd";
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        if (window.devicePlatform == "android") {
            Cordova.exec(success, null, "DateTimePicker", "date", [defaultDate, format]);
        } else if (window.devicePlatform == "iOS") {
            app.dateTimePicker.wheelSelectDate(callback, defaultDate, format);
        }
    };

    /**
      *   选择时间
      *   @method app.dateTimePicker.selectTime
      *   @param callback {Function} 回调函数
      *   @param defaultTime {Object} 默认弹出的时间
      *   @param format {String}  返回时间格式
      *   @param is24Hours {String}  是否是24小时制，默认是true
      *   @example
      *   app.dateTimePicker.selectTime (function(res){
      *       app.alert("您选择了:"+JSON.stringify(res));
      *   }, null, "hh mm", true);
    */
    app.dateTimePicker.selectTime = function (callback, defaultTime, format,
        is24Hours) {
        var toDate = new Date();
        defaultTime = defaultTime || {
            "hour": toDate.getHours(),
            "minute": toDate.getMinutes()
        };
        format = format || "hh:mm";
        is24Hours = is24Hours || true;
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        if (window.devicePlatform == "android") {
            Cordova.exec(success, null, "DateTimePicker", "time", [
                defaultTime, format, is24Hours]);
        } else if (window.devicePlatform == "iOS") {
            app.dateTimePicker.wheelSelectTime(callback, defaultTime, format, is24Hours);
        }
    };

    /**
      *   选择日期-滚轮
      *   @method app.dateTimePicker.wheelSelectDate
      *   @param callback {Function} 回调函数
      *   @param defaultDate {Object} 默认日期，默认是今天的年月日
      *   @param format {String}  日期格式，默认是"yyyy-MM-dd"
      *   @param range {Object}  年份的范围，格式如{ "minYear": 2000, "maxYear": 2046 }
      *   @param isFormat {String} 是否支持格式化，例如只选择年月等。默认是false，format在设置true的时候才生效
      *   @example
      *   app.dateTimePicker.wheelSelectDate (function(res){
      *       app.alert("您选择了:"+JSON.stringify(res));
      *   }, null, null, { "minYear": 1980, "maxYear": 2013 });
     */
    app.dateTimePicker.wheelSelectDate = function (callback, defaultDate,
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
        var success = function (result) {
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
      *   选择时间-滚轮
      *   @method app.dateTimePicker.wheelSelectTime
      *   @param callback {Function} 回调函数
      *   @param defaultTime {Object} 默认弹出的时间
      *   @param format {String}  返回时间格式
      *   @param is24Hours {String}  是否是24小时制，默认是true
      *   @example
      *   app.dateTimePicker.wheelSelectTime (function(res){
      *       app.alert("您选择了:"+JSON.stringify(res));
      *   }, null, null, false);
    */
    app.dateTimePicker.wheelSelectTime = function (callback, defaultTime,
        format, is24Hours) {
        var toDate = new Date();
        defaultTime = defaultTime || {
            "hour": toDate.getHours(),
            "minute": toDate.getMinutes()
        };
        format = format || "hh:mm";
        is24Hours = is24Hours || true;
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "WheelSelectPlugin", "time", [defaultTime, format, is24Hours]);
    }



    /**
    *  短信电话，发短信，打电话，获取sim卡信息等
    *  @namespace app.phone
    */
    window.app.phone = window.app.phone || {};

    /**
    *  发短信
    *  @method app.phone.sendSMS
    *  @static
    *  @param phone {String}  电话号码
    *  @param message {String} 信息内容
    *  @example
        app.phone.sendSMS("10086,10000","你好,我要使用BingoTouch");
    */
    app.phone.sendSMS = function (phone, message) {
        Cordova.exec(null, null, "PhonePlugin", "sms", [phone, message]);
    }

    /**
    *  打电话
    *  @method app.phone.dial
    *  @param phone {String}  电话号码
    *  @example
        app.phone.dial("10086");
    */
    app.phone.dial = function (phone) {
        Cordova.exec(null, null, "PhonePlugin", "dial", [phone]);
    }

    /**
     *  获取sim卡信息
     *  deviceId, phoneNumber, operatorName,
     *  simCountryIso, simSerialNumber, subscriberId, networkType,
     *  deviceSoftwareVersion, voiceMailAlphaTag, voiceMailNumber等
     *  @method app.phone.getSimInfo
     *  @static
     *  @param callback {Function} 回调函数，返回json对象
     *  @example
     *  app.getSimInfo(function(res){
     *      app.alert(res);
     *  });
    */
    app.getSimInfo = function (callback) {
        var success = function (res) {
            callback(app.utils.toJSON(res));
        }
        Cordova.exec(success, null, "ExtendApp", "getSimInfo", []);
    }



    /**
    *  扫码，二维码／条形码扫描
    *  @namespace app.barcode
    */
    window.app.barcode = window.app.barcode || {};

    /**
      *   该接口用于调用二维码扫描
      *   @method app.barcode.scan
      *   @param success 成功回调方法
      *   @param fail 失败回调方法
      *   @example
      *   app.barcode.scan(function(result) {
      *       app.alert(result)
      *   }, function(result) {
      *       app.alert(result)
      *   });
    */
    app.barcode.scan = function (success, fail) {
        Cordova.exec(success, fail, "BarcodeScanner", "scan", []);
    }




    /**
      * 退出程序（<font color="red">android支持退出app，ios下通常不退出，在iOS尽量不要用此接口,在Link中可以通过此接口回到Link应用</font>）
      * @method app.exit
      * @example
        app.exit();
    */
    app.exit = function () {
        Cordova.exec(null, null, "ExtendApp", "exit", []);
    }

    /**
    *   检测是否存在某个app
    *   android:传入包名 eg: bingo.touch.debugger
    *   ios:urlSchemes eg: bingo-debugger://
    *   @method app.isExist
    *   @param appId {String} 应用Id
    *   @param callback {Function} 回调函数
    *   @example
    *   app.isExist("bingo.touch.debugger",function(res){
    *       if(res){
    *           app.hint("存在appId为bingo.touch.debugger的应用!");
    *       }else{
    *           app.hint("不存在appId为bingo.touch.debugger应用!")
    *       }
    *   });
    */
    app.isExist = function (appId, callback) {
        if (typeof appId == "undefined") {
            app.alert("appId is necessary!");
            return;
        }
        callback = callback || function (result) {
            app.alert(result);
        };
        Cordova.exec(callback, null, "ExtendApp", "isExistApp", [appId]);
    }

    /**
     *  执行第三方的应用，如果是传入http的远程地址，将会调用系统自带的浏览器打开远程页面
     *  android: package name eg: bingo.touch.debugger
     *  ios: urlSchemes eg: http://www.baidu.com open safari
     *  @method app.run
     *  @param appId {String} 应用Id
     *  @param data {Object} 启动参数
     *  @example
     *  app.run("bingo.touch.demo",{
     *      "user" : "yulsh",
     *      "status" : 1
     *  });
    */
    app.run = function (appId, data) {
        if (typeof (data) == "undefined" || data == "") {
            data = {};
        }
        Cordova.exec(null, null, "ExtendApp", "runApp", [appId, data]);
    }

    /**
     *  获取app相关信息
     *  res包含三个属性，id:程序的id号、versionCode:版本编码、versionName：版本名称
     *  @method app.getInfo
     *  @param callback {Function} 回调函数
     *  @example
     *  app.getInfo(function(res){
     *      app.alert(res);
     *  });
    */
    app.getInfo = function (callback) {
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "ExtendApp", "getInfo", []);
    }

    /**
     *  安装应用（<font color="red">仅android平台适用,iOS平台是通过请求plist的方式安装</font>）
     *  @method app.install
     *  @param fileUrl {String} 文件路径
     *  @param success {Function} 安装成功回调
     *  @param fail {Function} 安装失败回调
     *  @example
        app.install(fileUrl);
    */
    app.install = function (fileUrl, success, fail) {
        success = success || function (res) {
            app.hint(res);
        };
        fail = fail || function (res) {
            app.hint(res);
        };
        if (window.devicePlatform == "android") {
            Cordova.exec(success, fail, "ExtendApp", "install", [fileUrl]);
        } else if (window.devicePlatform == "iOS") {
            app.alert("iOS platform do not support this api!");
        }
    }

    /**
     *  获取app安装后的相关目录
     *  android和ios的目录结构不同
     *  android下可以存储在 /sdcard/download下面
     *  ios只能存储在应用里面
     *  @method app.getAppDirectoryEntry
     *  @param callback {Function} 回调函数
     *  @example
     *  app.getAppDirectoryEntry(function(res){
     *      //区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
     *      if(window.devicePlatform=="android"){
     *          window.savePath=res.sdcard;
     *      }else if(window.devicePlatform=="iOS"){
     *          window.savePath=res.documents;
     *      }
     *  });
    */
    app.getAppDirectoryEntry = function (callback) {
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "ExtendApp", "getAppDirectoryEntry", []);
    }


    /**
     *  打开文件:如office文件,apk等，将调用系统的程序来打开文件
     *  @method app.openFile
     *  @param filePath {String} 文件地址
     *  @param mime {String} mime类型
     *  @param success {Function} 打开成功回调
     *  @param fail {Function} 打开失败回调
     *  @example
     *  app.openFile("file:///mnt/sdcard/bingotouch.docx","docx",function(res){
     *      app.hint("打开成功!");
     *  });
    */
    app.openFile = function (filePath, mime, success, fail) {
        filePath = filePath || "";
        mime = mime || "";
        success = success || function (result) { };
        fail = fail || function (result) {
            app.hint("没有找到合适的程序打开该文件");
        };

        if (window.devicePlatform == "iOS") {
            //ios无需带上file
            filePath = filePath.replace("file://", "");
        }
        Cordova.exec(success, fail, "ExtendApp", "openFile", [filePath, mime]);
    }

    /**
     *  控制屏幕旋转
     *  @method app.rotation
     *  @param type {string} landscape 横屏锁定、portrait 竖屏锁定
     *  @example
        app.rotation("landscape"); //表示当前页面需要横屏锁定显示；
        app.rotation("portrait"); //表示竖屏锁定
        app.rotation("user");  //解除锁定，恢复横竖屏(仅android)。
    */
    app.rotation = function (type) {
        Cordova.exec(null, null, "RotationPlugin", "setRotation", [type]);
    }


    /**
    *  获取当前坐标
    *  @method app.getLocation
    *  @param success {Function} 成功回调函数,返回json对象
    *  @param fail {Function} 失败回调函数，返回错误信息
     */
    app.getLocation = function (success, fail) {
        var callbackSuccess = function (result) {
            success(app.utils.toJSON(result));
        }
        Cordova.exec(callbackSuccess, fail, "LocationPlugin", "location", []);
    }

    /**
    *   获取设备的尺寸
    *   height:屏幕的高度、width:屏幕的宽度
    *   @method app.getSize
    *   @param callback {Function} 回调函数
    *   @example
    *   app.getSize(function(res){
    *       app.alert(res);
    *   });
    */
    app.getSize = function (callback) {
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "ExtendApp", "getSize", []);
    }

    /**
    * 设备震动提醒
    * @method app.vibrate
    * @param mills {int} 毫秒ms
    */
    app.vibrate = function (mills) {
        navigator.notification.vibrate(mills);
    }

    /**
    * 打开本地通讯录选择通讯录信息
    * @method app.openContactSelector
    * @param  callback {Function} 回调函数,返回json数组，包含名称和手机号等
    */
    app.openContactSelector = function (callback) {
        Cordova.exec(callback, null, "ContractEx", "getContracts", []);
    }

    /**
     *  @namespace app.utils
    */
    window.app.utils = window.utils || {};

    /**
     *  将json字符串转成json对象
     *  @method app.utils.toJSON
     *  @param jsonStr {String} JSON字符串
     *  @return {Object} JSON对象
     */
    app.utils.toJSON = function (jsonStr) {
        return typeof (jsonStr) == "string" ? eval('(' + jsonStr + ')') : jsonStr;
    }

    /**
     *  判断是否在PC上
     *  @method app.utils.isPC
     *  @returns {Boolean} true | false
     */
    app.utils.isPC = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    }

    /**
     *  滚轮
     *  @namespace app.wheelSelect
     */
    window.app.wheelSelect = window.app.wheelSelect || {};

    /**
      * 单选-滚轮
      * @method app.wheelSelect.oneSelect
      * @param data {Array} 被选择数据
      * @param callback {Function} 回调函数
      * @param selectedKey {String}  默认选中key
      * @param title {String} 标题
      * @param buttons {Object}  按钮设置
      * @example
      * $("#selectOrg").click(function(){
      *     app.wheelSelect.oneSelect( [{key:"o1",value:"平台"},{key:"o2",value:"电信"}], function(res){
      *         $("#selectOrg").btselect("val",res, null);
      *     }, "o1", "选择部门", { "sureBtn": "确定啦", "cancelBtn": "取消啦" } );
      * });
    */
    app.wheelSelect.oneSelect = function (data, callback, selectedKey, title,
        buttons) {
        data = data || [];
        title = title || "提示";
        buttons = buttons || {
            "sureBtn": "确定",
            "cancelBtn": "取消"
        };
        selectedKey = selectedKey || "";
        var success = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(success, null, "WheelSelectPlugin", "oneSelect", [data,
            selectedKey, title, buttons]);
    }

    /**
      * 本地通知
      * @namespace app.notification
    */
    window.app.notification = window.app.notification || {};

    /**
      * 该接口用于发起本地通知
      * @method app.notification.notify
      * @param title {String} 标题
      * @param body {String} 主要内容
      * @param isAutoDisapper {boolean} 是否自动移除
      * @param disapperTime {long} X时间后移除
      * @param clickAction {String} 点击本地通知回到activity后执行的JS方法
      * @param clickActionParams {JsonArray} 方法的参数
      * @example
      * $("#btnNotification").tap(function() {
      *         var params = {
      *         "title":"理想",
      *         "body":"这是理想！",
      *         "isAutoDisappear":true,
      *         "disappearTime":5000,
      *         "clickAction": "afterNotification",
      *         "clickActionParams": {"title":"理想"}
      *         };
      *     app.notification.notify(params);
      * });
      * afterNotification = function(param){
      *     alert(param.title);
      * }
    */
    app.notification.notify = function (params) {
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
      * 运行时定时任务接口
      * @namespace app.timetask
    */
    window.app.timetask = window.app.timetask || {}

    /**
      * 开启一个定时任务
      * @method app.timetask.start
      * @param params {Object} 启动定时任务需要的参数
        id: 定时任务id，id重复不能重复
        taskAction: 定时执行的动作，这里可以是方法名或者匿名方法
        maxCount: 任务最多执行的次数，不传默认1w次
        loopTime: 任务执行间隔时间，单位是毫秒
        isImmediate: 是否立刻执行，默认不立刻执行，loopTime 毫秒后才执行
        callback: 回调函数，返回json对象。如｛id:"",status:"",desc:""｝
    */
    app.timetask.start = function (params) {
        params = params || {};
        params.id = params.id || "";
        params.taskAction = params.taskAction || "";
        params.maxCount = params.maxCount || 10000;//默认执行1w次
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
        var nativeCallback = function (result) {
            params.callback(app.utils.toJSON(result));
        }
        Cordova.exec(nativeCallback, null, "TimeTask", "taskStart", [params]);
    }

    /**
      * 结束一个定时任务
      * @method app.timetask.stop
      * @param id {String} 任务id
      * @param callback {function} 回调函，数返回json对象。如｛id:"",status:"",desc:""｝
    */
    app.timetask.stop = function (id, callback) {
        id = id || "";
        if (id == "") {
            app.alert("任务id不能为空!");
            return;
        }
        var nativeCallback = function (result) {
            callback(app.utils.toJSON(result));
        }
        Cordova.exec(nativeCallback, null, "TimeTask", "taskStop", [id]);
    }




    /***
      * 社会化分享插件
      * @class shareplugin
    ***/
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
    app.shareplugin.share = function (params) {
        Cordova.exec(null, null, "ShareSDKPlugin", "share", [params.title, params.titleUrl, params.text, params.url, params.comment, params.siteName, params.siteUrl]);
    }

    /**
      * 微信支付
      * @namespace app.wxPay
    */
    app.wxPay = {}
    /**
       * 将该app注册到微信
       * @method app.wxPay.register
       * @param appId {String} 微信支付商户的APPID
       * @param success {Function} 成功回调函数
       * @param fail {Function} 失败回调函数，返回错误信息
       * @example
        app.wxPay.register('wx70e80fed5356ae88', function(res){
            app.alert(res)
        }, function(err){
            app.alert(err)
        }); 
     */
    app.wxPay.register = function(APPID, success, error){
        Cordova.exec(success, error, "PayPlugin", "register", [{"paySdk":"wxPay", "key": APPID}]);
    }

    /**
     * 调起微信支付
     * @param params {Object} 微信支付参数
     * 字段有appId，partnerId，prepayId，packageValue，nonceStr，timeStamp，sign
     * 详情请查看微信官方文档：https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=4_3
     * @param success {Function} 成功回调函数
     * @param fail {Function} 失败回调函数，返回错误信息
     * @example
        var obj = {
            appId: "wxf42b1fc0dd6bcc3a",
            partnerId: "1495054112",
            prepayId: "wx171702472605294941a5b4891282591800",
            packageValue: "Sign=WXPay",
            nonceStr: "934af1cb4eec45c1aafb96680e170e65",
            timeStamp: "1581930166",
            sign: "0628171B74DBDBE577093C607EB559EB"
        }
        app.wxPay.startPay(obj, function(res){
            app.alert(res);
        }, function(err){
            app.alert(err);
        })
     */
    //字段有appId，partnerId，prepayId，packageValue，nonceStr，timeStamp，sign
    app.wxPay.startPay = function(params, success, error){
        params.paySdk = "wxPay";
        Cordova.exec(success, error, "PayPlugin", "pay", [params]);
    }

    /**
      * 获取页面传递的参数
      * @method app.setResult
      * @param data {Array} 传递参数
      * @example
      * app.setResult([1,2,3]);
    */
    app.setResult = function (data) {
        Cordova.exec(null, null, "Page", "setResult", [{ 'data': data }]);
    }
    /**
     * 页面头部操作
     * @namespace app.pageHeader
    */
    window.app.pageHeader = window.app.pageHeader || {};

    /**
     * 返回页面上一层，适用于单页面（4.6.1版本及以上）
     * @method app.pageHeader.backHistoryOrExit
     * @example
         app.pageHeader.backHistoryOrExit();
    */
    app.pageHeader.backHistoryOrExit = function () {
        Cordova.exec(null, null, "ExtendApp", "backHistoryOrExit", []);
    }

    /**
      * 监听头部关闭(4.6.1版本及以上)
      * @method app.pageHeader.closeButtonListener
      * @param callback {function} 回调函数
      * @example
        app.pageHeader.closeButtonListener(function(){
        });
    */
    app.pageHeader.closeButtonListener = function (callback) {
        Cordova.exec(callback, null, "WebHeader", "overrideCloseButton", []);
    }

    /**
      * 监听头部返回返回(4.6.1版本及以上)
      * @method app.pageHeader.backButtonListener
      * @param callback {function} 回调函数
      * @example
        app.pageHeader.backButtonListener(function(){
        });
    */
    app.pageHeader.backButtonListener = function (callback) {
        if (window.devicePlatform == "android") {
            document.addEventListener('backbutton', callback, false);
        } else {
            Cordova.exec(callback, null, "WebHeader", "overrideBackButton", []);
        }
    }

    /**
      * 设置头部标题(4.6.1版本及以上)
      * @method app.pageHeader.setHeaderTitle
      * @param titleName {String} 标题名称
    */
    app.pageHeader.setHeaderTitle = function (titleName) {
        document.title = titleName || '';
    }


    /**
      * 录音插件
      * @namespace app.recode
    */
    window.app.recode = window.app.recode || {};

    /**
     * 开始录音转文字（4.6.1版本及以上）
     * @method app.recode.startRecordToTxt
     * @param successCallback {function} 成功回调函数, 返回JSON对象[{isLast：true/false 录音是否结束状态。text：翻译结果。rawData：录音转文字原始JSON。audioFilePath：录音文件路径，调用结束录音方法后返回}]。
     * @param failCallback {function} 失败回调函数
     */
    app.recode.startRecordToTxt = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "SpeechRecognize", "start", []);
    }

    /**
     * 结束录音转文字（4.6.1版本及以上）
     * @method app.recode.stopRecordToTxt
     * @param successCallback {function} 成功回调函数, 注意，此方法只代表结束录音方法调用成功，并不意味着录音转文字结束，录音翻译文字成功标识为开始录音方法回调中isLast=true
     * @param failCallback {function} 失败回调函数
     */
    app.recode.stopRecordToTxt = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "SpeechRecognize", "stop", []);
    }

    /**
     * pcm录音文件转mp3（4.6.1版本及以上）
     * @method app.recode.recordToMp3
     * @param successCallback {function} 成功回调函数, output: mp3录音文件路径
     * @param failCallback {function} 失败回调函数 errorCode: 10001(input不存在),errorMsg: 错误信息
     * @param recordPath {string} 失败回调函数 pcm录音文件地址
     */
    app.recode.recordToMp3 = function (successCallback, failCallback, recordPath) {
        var params = {
            input: recordPath
        }
        Cordova.exec(successCallback, failCallback, "SpeechRecognize", "convertToMp3", [params]);
    }
})(window);

//页面完整加载完成
window.onload = function () {
    document.addEventListener("deviceready", function () {

        //声明页面事件
        app.page.onLoad();

    }, false);
}();





loader.global(function (global) {

    // link 调试请把下面代码注释去掉：原生请求支持请求远程地址，不支持请求相对路径
    // let needNative = navigator.userAgent.indexOf("linkmessenger") > -1 ? true : false;
    // bui.config.ajax = {
    //     needNative: needNative
    // }

    return {
        path: "",
        userinfo: {},
        token:"",
        ajax: function (opt) {
            /**
             * 全局的请求方法
             * 使用示例：
             * global.ajax({url:"",data:{}}).then(function(res){
                console.log(res)
                })
             */
            let props = $.extend(true, { headers: {} }, opt);
            return bui.ajax(props);
        },
        hint: function (text) {
            /**
             * 全局的提示
             * 使用示例：
             * global.hint("提示信息")
             */
            let props = $.extend(true, { position: "bottom" }, { content: text });
            return bui.hint(props);
        }
    }
})
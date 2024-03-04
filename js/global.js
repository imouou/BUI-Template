loader.global(function (global) {
    // 全局方法或者变量配置，需要在 index.html 引入 js/global.js
    
    return {
        path: "",
        ajax: function (opt) {
            /**
             * 全局的请求方法
             * 使用示例：
             * global.ajax({url:"",data:{}}).then(function(res){
                console.log(res)
                })
             */
            let props = $.extend(true, { headers: {}, contentType:"application/x-www-form-urlencoded" }, opt);
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
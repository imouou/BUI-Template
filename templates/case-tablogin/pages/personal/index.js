loader.define(function(require, exports, module) {

    // 初始化数据行为存储
    var bs = bui.store({
        scope: "page",
        data: {},
        methods: {
            logout: function() {
                // 修改全局状态会有相应处理
                store.isLogin = false;
                bui.load({ url: "pages/login/login.html", param: { type: "tab", index: 3 } })
            }
        },
        beforeMount: function() {
            // 数据解析前执行, 修改data的数据示例
            // this.$data.a = 2
        },
        mounted: function() {
            // 数据解析后执行
            console.log("personal is loaded")
        }
    })
})
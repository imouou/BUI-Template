loader.define(function(requires, exports, module) {

    // 初始化数据行为存储
    var bs = bui.store({
        scope: "page",
        data: {},
        methods: {
            logout: function() {
                // 修改全局状态会有相应处理
                store.isLogin = false;
            }
        },
        beforeMount: function() {
            // 数据解析前执行, 修改data的数据示例
            // this.$data.a = 2
        },
        mounted: function() {
            // 数据解析后执行
        }
    })
})
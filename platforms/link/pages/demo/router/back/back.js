loader.define(function(requires,exports,module,global){

    // 合并接收默认参数
    let props = $.extend(true, {}, module.props);

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
        },
        methods: {
            back(){
                // 普通后退
                bui.back()
            },
            backRefresh(){
                // 后退刷新
                bui.back({
                    // index: -1, 可以后退多层
                    callback(mod){
                        bui.refresh();
                    }
                })
            },
            backCallback(){

                bui.back({
                    // index: -1,
                    callback(mod){
                        // 获取到上一个模块，调用上一个模块局部刷新的方法
                        console.log(mod)
                    }
                })
            }
        },
        watch: {},
        computed: {},
        templates: {},
        mounted: function(){
            // 数据解析后执行
        }
    })
})
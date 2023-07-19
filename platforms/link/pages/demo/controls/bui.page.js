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
            open(){
                var uiListPage = bui.page({
                    url:"pages/demo/components/list/index.html",
                    param: {},// 传参数给列表组件
                    // 以下是常用参数，默认可以不传
                    position:"bottom",
                    effect:"fadeInUp",
                    close: true,
                    mask: true,
                    autoClose: true,
                    syncHistory: false,// 同步历史记录，调试不用开启
                    style: {
                        top: "30%"
                    }
                })
            }
        },
        watch: {},
        computed: {},
        templates: {},
        beforeMount: function(){
            // 数据解析前执行, 修改data的数据示例
            // this.$data.a = 2
        },
        mounted: function(){
            // 数据解析后执行
        }
    })
})
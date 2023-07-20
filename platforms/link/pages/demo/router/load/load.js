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
            load(){

                bui.load({
                    url:"pages/demo/router/load/load.html",
                    param:{
                        id:"easybui"
                    }
                })
            },
            getProps(){
                bui.alert(props)
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
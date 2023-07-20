loader.define(function(requires,exports,module,global){

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
        },
        methods: {
            refresh(){
                console.log("refresh")
                bui.refresh();
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
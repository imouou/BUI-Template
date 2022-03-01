loader.define(function(requires,exports,module,global){

    var params = bui.history.getParams(module.id);

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page1",
        data: {
           id: params.id,
        },
        methods: {},
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
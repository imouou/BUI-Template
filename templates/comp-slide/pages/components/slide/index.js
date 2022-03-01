loader.define(function(requires,
    export, module) {
    // 接收`component` 标签上的属性参数
    var params = bui.history.getParams(module.id);
    // 轮播图控件初始化
    var uiSlide = bui.slide({
            // 通过父层的id 找到当前的 bui-slide
            id: `#${module.id} .bui-slide`,
            height: 300,
            data: []
        })
        // 通过不同参数请求区分不同数据
    bui.ajax({
        // 模块在被加载或者被移到其它路径下, 都不会影响到这个路径的地址.
        url: `${module.path}/index.json`,
        data: {
            // 请求接口的不同类型
            type: params.type
        },
        success: function(res) {
            // 修改轮播图数据
            uiSlide.option("data", res);
        }
    })
    return uiSlide;
})
loader.define(function(requires, exports, module) {
    console.log("topic was loaded")
    var pageview = {
        init: function() {

        }
    };

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
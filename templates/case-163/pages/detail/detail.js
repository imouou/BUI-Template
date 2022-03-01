loader.define(function(requires, exports, module) {
    // 获取新闻的参数
    var pageParams = router.getPageParams();

    console.log(pageParams)

    var pageview = {
        init: function() {

        }
    };

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
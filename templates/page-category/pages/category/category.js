/**
 * 分类模板
 * 默认模块名: pages/category/category
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(requires, exports, module) {

    var pageview = {
        init: function() {
            var tabWidth = $(window).width() - $("#tabSideNav").width();

            //按钮在tab外层,需要传id
            var tab = bui.tab({
                id: "#tabSide",
                menu: "#tabSideNav",
                width: tabWidth,
                direction: "y",
                animate: false
            })
        }
    }
    pageview.init();
})
/**
 * 分类模板
 * 默认模块名: pages/category/category
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var tabWidth = $(window).width() - $("#tabSideNav").width();

        //按钮在tab外层,需要传id
        var tab = bui.tab({
            id:"#tabSide",
            menu:"#tabSideNav",
            width: tabWidth,
            direction: "y",
            animate: false
        })
})

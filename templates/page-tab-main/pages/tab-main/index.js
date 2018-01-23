/**
 * 导航TAB平分模板
 * 默认模块名: pages/tab-main/index
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {
    
    var pageview = {};
    
    // 模块初始化定义
    pageview.init = function () {
        navTab();
    }

    // 底部导航
    function navTab() {
        var tab = bui.slide({
            id:"#tabMain",
            menu:".bui-nav",
            children:".bui-tab-main ul",
            scroll: true,
            animate: false,
            autoload: true,
        })

        // 2: 监听加载后的事件, load 只加载一次
        tab.on("load",function (res) {
            var index = $(this).index();
            switch(index){
                case 0:
                loader.require(["pages/main/home"])
                break;
                case 1:
                loader.require(["pages/main/news"])
                break;
            }
        })

         // 让顶部导航滚动到可视位置, 如果导航平分宽度,可以注释掉
         tab.on("to",function (index) {
            var left = $("#tabMainNav li")[index].offsetLeft;
            document.getElementById("tabMainNavbar").scrollLeft = left;
         })
    }

    // 初始化
    pageview.init();

    // 输出模块
    module.exports = pageview;
    
})
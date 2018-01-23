/**
 * 顶部导航TAB模板
 * 默认模块名: pages/tab-head/index
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
        
        //按钮在tab外层,需要传id
        var tab = bui.slide({
            id:"#tabHead",
            menu:"#tabHeadNav",
            children:".bui-tab-main ul",
            scroll: true,
            animate: false,
            // 1: 声明是动态加载的tab
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
    }

    // 初始化
    pageview.init();
    // 输出模块
    module.exports = pageview;
    
})
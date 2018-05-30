/**
 * 底部导航TAB模板
 * 默认模块名: main
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
        
        //menu在tab外层,menu需要传id
        var tab = bui.slide({
            id:"#tabDynamic",
            menu:"#tabDynamicNav",
            children:".bui-tab-main ul",
            scroll: true,
            animate: false,
            // 1: 声明是动态加载的tab
            autoload: true,
        })
        // 2: 监听加载后的事件
        tab.on("to",function (res) {
            var index = $(this).index();
            switch(index){
                case 0:
                loader.require(["pages/main/home"],function (mod) {
                    // 有回调的话是每次切换都会触发
                    mod.init();
                })
                break;
                case 1:
                    // 这里是加载脚本第一次的时候触发
                loader.require(["pages/main/news"])
                break;
                case 2:
                loader.require(["pages/main/photo"])
                break;
                case 3:
                loader.require(["pages/main/setting"])
                break;
            }
        }).to(0);
    }

    // 初始化
    pageview.init();
    
    // 输出模块
    return pageview;
    
})
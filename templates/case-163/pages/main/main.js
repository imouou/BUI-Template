/**
 * 底部导航TAB模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require, exports, module) {

    var pageview = {
        init: function() {
            this.tab();

            // 栏目弹出菜单, 因为要遮住底部的导航, 所以弹出层需要跟底部导航在一块初始化
            this.columnDialog = bui.dialog({
                id: "#uiDialog",
                position: "right",
                fullscreen: true,
                effect: "fadeInRight",
                mask: false
            });
        },
        tab: function navTab() {

            //menu在tab外层,menu需要传id
            var tab = bui.tab({
                    id: "#tabDynamic",
                    menu: "#tabDynamicNav",
                    swipe: false,
                    animate: false
                })
                // 2: 监听加载后的事件, load 只加载一次
            tab.on("to", function() {
                var index = this.index() || 0;

                // 延迟加载
                loader.delay({
                    id: `#tab${index}`
                })
            })
        }
    };


    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
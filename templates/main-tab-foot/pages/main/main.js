/**
 * 底部导航TAB模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require, exports, module) {

    var pageview = {
        init: function() {
            this.tab();
        },
        tab: function() {

            //menu在tab外层,menu需要传id
            var tab = bui.tab({
                id: "#tabDynamic",
                menu: "#tabDynamicNav",
                // animate: false, // 跳转无动画
                swipe: false, // 不滑动
            })

            // 2: 监听加载后的事件
            tab.on("to", function() {
                var index = this.index();
                // 只加载一次, 如果需要每次都重新渲染
                // if (bui.history.checkComponent(`tab${index}`)) {
                //     loader.component({
                //         id: `#tab${index}`,
                //     })
                //     return;
                // }
                loader.delay({
                    id: `#tab${index}`,
                })

            }).to(0);
        }
    };


    // 初始化
    pageview.init();

    // 输出模块
    return pageview;

})
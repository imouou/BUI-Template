loader.define(function(require, exports, module) {
    // 用户的登录状态
    var uiTab = null;
    var that = this;
    var pageview = {
        init: function() {
            // 初始化tab
            this.tabInit();
        },
        tabInit: function() {
            if (uiTab) {
                return this;
            }
            // 初始化tab
            uiTab = bui.tab({
                id: "#uiTab",
                animate: false
            });

            // 跳转第一次的时候就自动编译
            uiTab.on("to", function() {
                var index = this.index();
                console.log(index)
                    // 动态加载延迟的每个tab
                loader.delay({
                    id: "#tab" + index
                })
            })
        }
    }

    pageview.init();

})
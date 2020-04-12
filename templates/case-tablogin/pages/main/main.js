loader.define(function(require, exports, module) {

    // 用户的登录状态
    var uiTab = null;
    var that = this;
    var loginPage = null;
    var pageview = {
        needRender: true,
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
                menu: "#uiTabNav",
                animate: false
            });

            // 跳转第一次的时候就自动编译
            uiTab.on("to", function() {
                var index = this.index();
                // 个人中心需要登录, 暂不加载
                if (index == 3 && !store.isLogin) {
                    bui.load({ url: "pages/login/login.html", param: { type: "tab", index: 3 } })
                    return;
                }
                // 如果个人中心已经加载过,需要重新渲染, 比方用户切换了用户, 后退操作的时候用的
                if (index == 3 && bui.history.checkComponent("tab3") && pageview.needRender) {
                    loader.component({
                        id: "#tab3"
                    })

                    // 不需要再次渲染了
                    pageview.needRender = false;
                    return;
                }
                // 动态加载延迟的每个tab, 然后再次切换的时候,不会每次都重新请求
                loader.delay({
                        id: "#tab" + index
                    })
                    // 不需要再次渲染了
                pageview.needRender = false;

            })
        }

    }
    pageview.init();
    // 把tab抛出给外部操作
    pageview.tab = uiTab;

    return pageview;
})
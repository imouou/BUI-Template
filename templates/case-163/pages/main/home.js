/**
 * [新闻模块]
 */
loader.define(function(requires, exports, module) {
    var pageview = {
        init: function() {
            // 初始化导航
            this.nav();

            // 初始化更多分类
            this.category();
        },
        category: function() {
            // 动态插入更多栏目页面
            var page = bui.page({
                url: "pages/components/category/index.html",
                autoload: false,
                style: {
                    top: ".9rem",
                    bottom: "1.1rem"
                }
            });
            // 触发新闻导航自定义对话框
            router.$(".btn-dropdown").click(function() {
                page.open();
            })
            return page;
        },
        nav: function(argument) {

            // 新闻导航选项卡 js 初始化:
            var uiNewsTab = bui.tab({
                    id: "#uiNewsTab",
                    menu: "#uiNewsTabNav",
                    scroll: false,
                    animate: false,
                })
                // 让顶部导航滚动到可视位置
            uiNewsTab.on("to", function() {
                var index = this.index();

                // 有滚动条时在居中显示
                var itemwidth = $("#uiNewsTabNav li").eq(index).prev().width();
                var left = $("#uiNewsTabNav li")[index].offsetLeft - itemwidth * 2;
                document.getElementById("uiSlideNavbar").scrollLeft = left;

                // 延迟加载
                loader.delay({
                    id: `#newsTab${index}`
                })

            })
        }
    }

    pageview.init();

    return pageview;
})
/**
 * 侧边栏模板
 * 默认模块名: pages/sidebar/sidebar
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require, exports, module) {

    var pageview = {
        init: function() {
            //示例代码
            var uiSidebar = bui.sidebar({
                id: "#sidebarWrap", //菜单的ID(必须)
                width: 644,
                trigger: "#menu"
            });
        }
    };
    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
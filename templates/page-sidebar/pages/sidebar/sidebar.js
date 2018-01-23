/**
 * 侧边栏模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {
    
    var pageview = {};

    // 模块初始化定义    
    pageview.init = function () {
        // 侧边栏初始化
        var uiSidebar = bui.sidebar({
            id: "#sidebarWrap", //菜单的ID(必须)
            width:400,
            trigger: "#menu"
        });
    }

    // 初始化
    pageview.init();
    
    // 输出模块
    module.exports = pageview;
})
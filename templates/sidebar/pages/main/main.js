// 默认已经定义了main模块
loader.define(function(require,exports,module) {
    //示例代码
    var uiSidebar = bui.sidebar({
        id: "#sidebarWrap", //菜单的ID(必须)
        width:400,
        trigger: "#menu"
    });
})
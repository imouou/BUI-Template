// 多页的初始化都在 bui.ready
bui.ready(function() {


    // 绑定事件
    bind();
})

// 事件类定义
function bind() {
    // 绑定页面的所有按钮有href跳转
    bui.btn({ id: ".bui-page", handle: ".bui-btn" }).load();

}
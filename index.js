window.router = bui.router();

bui.ready(function (global) {
    // 初始化路由
    router.init({
        id: "#bui-router",
        progress: true,
        firstAnimate: true,
    })

    // 绑定事件
    bind();

})

// 事件类定义
function bind() {
    // 绑定页面的所有按钮有href跳转
    bui.btn({ id: "#bui-router", handle: ".bui-btn" }).load();

    // 防止多次点击后退
    bui.btn({ id: "#bui-router", handle: ".btn-back" }).click(function(e){
        // 支持后退多层,支持回调
        bui.back();
    });

}
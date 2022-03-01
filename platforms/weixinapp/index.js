window.router = bui.router();


bui.ready(function(global) {
    // 初始化路由
    router.init({
        id: "#bui-router",
        progress: true,
        hash: true,
    })

    // 绑定事件
    bind();

    // 事件类定义
    function bind() {
        // 绑定页面的所有按钮有href跳转
        bui.btn({ id: "#bui-router", handle: ".bui-btn" }).load();

        // 统一绑定页面所有的后退按钮
        $("#bui-router").on("click", ".btn-back", function(e) {
            // 支持后退多层,支持回调
            bui.back();
        })

        router.on("pageshow",function(e){
            // 修改后退的标题
            document.title = e.target?.exports?.title || e.target?.exports?.$data.title || "BUI";
        })
    }
})

// 微信的初始化
if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
    document.addEventListener('WeixinJSBridgeReady', ready, false)
} else {
    ready()
}

// 微信api在这里初始化
function ready() {
    
}


// 开启单页路由
window.router = bui.router();

// DOM准备完毕
bui.on("pageinit",function(){

    // 初始化路由, appcan不支持历史记录,所以这里syncHistory需要设置为false.
    router.init({
        id: "#bui-router",
        syncHistory: false
    })
    
    // 绑定事件
    bind();

    function bind() {
        // 绑定页面的所有按钮有href跳转
        bui.btn({id:"#bui-router",handle:".bui-btn"}).load();

        // 统一绑定页面所有的后退按钮
        $("#bui-router").on("click",".btn-back",function (e) {
            // 支持后退多层,支持回调
            bui.back();
        })
    }
})

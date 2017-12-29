window.router = bui.router();

bui.on("pageinit",function(){

    // 初始化路由
    router.init({
        id: "#bui-router"
    })

    // 绑定示例页面的按钮带href跳转
    bui.btn({id:"#bui-router",handle:".bui-btn"}).load();

})

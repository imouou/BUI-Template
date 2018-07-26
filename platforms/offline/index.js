// 网站配置
var sitePath = "http://www.easybui.com",
    siteDir = sitePath + "/demo/json/";


// 设置当前应用模式
bui.isWebapp = true;

// 微信调试的时候,可以设置为false,禁止缓存
// window.loader = bui.loader({
//     cache: false
// })


// 路由初始化给全局变量,必须是router
window.router = bui.router();



bui.ready(function () {
    // 第3步: 初始化路由
    router.init({
        id: "#bui-router",
        progress: false,
        // webapp部署的时候改为true, 这样物理刷新缓存还在
        reloadCache: false
    })

    // 绑定事件
    bind();

})

/**
 * [bind 绑定页面事件]
 * @return {[type]} [description]
 */
function bind() {

    // 绑定应用的所有按钮有href跳转, 增加多个按钮监听则在hangle加逗号分开.
    bui.btn({id:"#bui-router",handle:".bui-btn"}).load();

    // 统一绑定应用所有的后退按钮
    $("#bui-router").on("click",".btn-back",function (e) {
        // 支持后退多层,支持回调
        bui.back();
    })

    // 监听全局后退事件处理
    router.on("back",function (e) {
        var pid = e.target.pid;

        console.log(pid)
    })

}



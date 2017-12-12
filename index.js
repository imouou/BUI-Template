
// 第2步: 开启单页路由
window.router = bui.router();
// 把模块的常用方法,赋给window变量
window.define = loader.define;
window.require = loader.require;

bui.ready(function(){
    // 第3步: 初始化路由
    router.init({
        id: "#bui-router"
    })

    // 一个单页应用只需要初始化一次,按钮加上 href 就可以跳转了,跳转会自动查找同目录下的同名.js文件
    bui.btn({id:"#bui-router",handle:".bui-btn"}).load();

});

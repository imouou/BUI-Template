/*--------------------------------------------------
 bingotouch 开发常见问题

 1. bui.isWebapp为false 才能调用原生方法，且这个状态必须在 bui.ready 的前面
 2. 控制台输入 bui.currentPlatform 显示bingotouch，代表有bingotouch原生的一些方法，如 bui.ajax, bui.list, bui.upload 等
 3. 在PC调试时，请搜索打开跨域的chrome，或者配置 app.json 代理方式，具体查看文档
 4. 在手机Debugtool调试也会有跨域问题，上架则没有，要解决跨域问题，可以尝试切换成原生方法(原生方法不支持put之类的请求), 切换后原生方法不支持在PC调试
    // ajax全局配置请求
    bui.config.ajax = {needNative: true };
    // 自动分页列表请求
    bui.config.list = {needNative: true };
 5. 原生API文档：https://open.bingosoft.net/btapi-demo/index.html

----------------------------------------------------*/
// 绑定物理后退事件
/*
    bui.isWebapp = false;

    bui.on("pageready",function () {

      // 绑定手机后退按键
      bindBack();
    })

    // 绑定手机后退按键
    function bindBack(argument) {
      // 监听后退按钮
       var flag = 0,
           quickClick = 0,
           timeout;
      try{
       document.addEventListener("backbutton", function() {

        if( router.getHistory().length > 1 ){
          // 防止快速点击导致历史记录错乱
          if( quickClick == 0 ){
            bui.back();
            quickClick = 1;
            //.5s后重新设置回去
            timeout = setTimeout(function() {
              quickClick = 0;
             }, 500);
          }
        }else{
            if (flag == 0) {
             bui.hint("再按一次就退出应用了!");
             flag = flag + 1;
             //2s后重新设置回去
            timeout = setTimeout(function() {
              flag = 0;
             }, 2000);
            } else if (flag == 1) {
             app.exit();
            }
        }

       }, false);
      }catch(e){}
    }

*/

// debugtool调试扫码时，需要切换成原生，才没有跨域问题
// bui.config.ajax = {
//   needNative: true
// }

// 开启单页路由
window.router = bui.router();
// DOM准备完毕
bui.ready(function (global) {
  // 初始化路由
  router.init({
    id: "#bui-router",
    progress: true,
    hash: true,
  })

  // 绑定事件
  bind();

})

function bind() {
  // 绑定页面的所有按钮有href跳转
  bui.btn({ id: "#bui-router", handle: ".bui-btn,a" }).load();

  // 统一绑定页面所有的后退按钮
  $("#bui-router").on("click", ".btn-back", function (e) {
    // 支持后退多层,支持回调
    bui.back();
  })
}
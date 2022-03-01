/*-----------------------------------
 打包需要设置isWebapp为false 才能绑定后退按键
------------------------------------------- */
/*
  bui.isWebapp = false;
  // 原生方法
  bui.on("pageready",function(){
      // 绑定手机后退按键
      bindBack();
  });

  // 绑定手机后退按键
  function bindBack() {
    // 监听后退按钮
    var flag = 0,
        quickClick = 0,
        timeout;
    try{
      // 隐藏滚动条
      plus.webview.currentWebview().setStyle({scrollIndicator:'none'});

       plus.key.addEventListener('backbutton', function(){
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
              plus.runtime.quit();

            }
        }

       }, false);
    }catch(e){}
  }

*/

// 开启单页路由
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

    function bind() {
        // 绑定页面的所有按钮有href跳转
        bui.btn({ id: "#bui-router", handle: ".bui-btn,a" }).load();

        // 统一绑定页面所有的后退按钮
        $("#bui-router").on("click", ".btn-back", function(e) {
            // 支持后退多层,支持回调
            bui.back();
        })
    }
})

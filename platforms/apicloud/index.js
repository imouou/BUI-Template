/*-----------------------------------------
 打包需要设置isWebapp为false 才能绑定后退按键
 并且 bui.ajax 使用原生的请求方式才不会有跨域问题
-------------------------------------------*/
/*
  bui.isWebapp = false;

  // 打包以后,apicloud的ajax有跨域问题,需要配置needNative 使用原生请求
  bui.config.ajax = { needNative: true };

  // 监听物理按键的后退
  bui.on("pageready",function () {

    // 绑定手机后退按键
    bindBack();
  })

  // 绑定手机后退按键
  function bindBack() {
    // 监听后退按钮
    var flag = 0,
        quickClick = 0,
        timeout;
    try{
      api.addEventListener({
          name: 'keyback'
      }, function(ret, err){
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
            api.closeWidget({
                  id: 'A6060942676868',     //这里改成自己的应用ID
                  retData: {name:'closeWidget'},
                  silent:true
              });
          }
        }

      });
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

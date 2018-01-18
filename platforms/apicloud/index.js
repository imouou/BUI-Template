
// bui.ajax web请求在apicloud有跨域问题,所以这里需要使用原生的请求方式
bui.debug = false;


// 第2步: 开启单页路由
window.router = bui.router();

bui.on("pageinit",function(){
    // 第3步: 初始化路由
    router.init({
        id: "#bui-router"
    })

})

// 在原生设备准备事件准备完成以后执行api监听方法
bui.ready(function () {
  // 监听后退按钮
  var flag = 0;
  api.addEventListener({
      name: 'keyback'
  }, function(ret, err){
    if( router.getHistory().length > 1 ){
        bui.back();
    }else{
      if (flag == 0) {
       bui.hint("再按一次就退出应用了!");
       flag = flag + 1;
       //2s后重新设置回去
       setTimeout(function() {
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
})

/*-----------------------------------------
# Cordova开发步骤

1. 剪切 config.xml 到根目录，gulpfile.js 同级
2. 修改 gulpfile.js 的dist目录，改为 www
```
const folder = {
    src: 'src',
    dist: 'www',
    temp: '.bui'
}
```
3. 全局安装 npm install -g cordova
4. 增加原生插件 cordova platform add browser
5. BUI只负责当前的UI构建，打包及使用Cordova原生插件，请查看Cordova官方文档  https://cordova.apache.org/
6. 打包前请确认 bui.isWebapp = false, 才能调用到原生方法，相当于 deviceready 
7. 打包前请先执行 npm run build ，会把es6编译成es5 

-------------------------------------------*/
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
           exitApp();
          }
      }

     }, false);
    }catch(e){}
  }

  // 退出应用
  function exitApp(){
      navigator.app.exitApp();
  }
*/


// 开启单页路由
window.router = bui.router();

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
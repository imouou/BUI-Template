/*--------------------------------------------------
 Link 开发常见问题

 1. bui.isWebapp为false 才能调用原生方法，且这个状态必须在 bui.ready 的前面
 2. 控制台输入 bui.currentPlatform 显示link，代表有Link原生的一些方法，如 bui.ajax, bui.list, bui.upload 等
 3. 轻应用在PC调试时，请搜索打开跨域的chrome，或者配置 app.json 的方式，具体查看文档
 4. 轻应用在手机Link调试也会有跨域问题，上架则没有，要解决Link扫码调试的跨域问题，可以尝试切换成原生方法(原生方法不支持put之类的请求), 有原生方法不支持在PC调试
    // ajax全局配置请求
    bui.config.ajax = {needNative: true };
    // 自动分页列表请求
    bui.config.list = {needNative: true };
 5. LINK的扫码调试或者上架，需要加上以下参数，区分不同的环境，现在新版的LINK 用 engine=cordova，旧的用 engine=cordova260
    例如： http://localhost:4141/index.html?engine=cordova
 6. 上架或者调试，部分ES6会导致应用空白，需要先编译，使用 npm run build 一次。
 7. LINK文档：http://linkdoc.bingosoft.net:8088/sidebars/bingoTouch/src/lightApp/intro.html
    LINK API文档：https://open.bingosoft.net/btapi-demo/index.html

----------------------------------------------------*/

// LINK上架或调试，要改成 false，才能确保所有原生方法均可获取，如 app.link.getToken;
bui.isWebapp = false;

// LINK调试改为使用原生，才能在LINK取到数据
// bui.config.ajax = {
//   needNative: true
// }

// 开启单页路由
window.router = bui.router();
// DOM准备完毕
bui.ready(function (global) {

  try {
    // LINK 调试
    app.link.getToken(function (result) {

      let token = result.accessToken;

      // 缓存到全局模块
      global.token = token;

      // Web初始化路由
      router.init({
        id: "#bui-router",
        progress: true,
        hash: true,
      })
    });

  } catch (e) {

    // Web调试
    router.init({
      id: "#bui-router",
      progress: true,
      hash: true,
    })

  }
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
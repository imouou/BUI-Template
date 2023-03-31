

var pageview = {
  init() {
    // dom准备完成
    this.webready();
    // 原生方法初始化完毕
    this.nativeready();
  },
  webready() {

    // 开启单页路由
    window.router = bui.router();

    // DOM准备完毕
    bui.ready(function (global) {

      // Web初始化路由
      router.init({
        id: "#bui-router",
        progress: true,
        hash: true,
      })

      // 绑定事件
      bind();

    })
  },
  nativeready() {

    // 安卓的初始化设备会更慢，要放在 window.onload 里面
    window.document.addEventListener("deviceready", function () {

      // LINK 调试
      app.link.getToken(function (result) {

        let token = result.accessToken;

        console.log(token)
      });

    }, false);

  },
  bind() {
    // 事件绑定
    // 绑定页面的所有按钮有href跳转
    bui.btn({ id: "#bui-router", handle: ".bui-btn,a" }).load();

    // 统一绑定页面所有的后退按钮
    $("#bui-router").on("click", ".btn-back", function (e) {
      bui.back();
    })
  }
}

// 页面开始执行
pageview.init();

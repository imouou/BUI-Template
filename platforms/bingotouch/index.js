

var pageview = {
  init() {

    let that = this;
    // dom准备完成
    this.webready();
    // 原生 ready
    if (bui.platform.isIos()) {
      window.onload = function () {

        that.nativeready();

      }
    } else {
      that.nativeready();
    }
  },
  webready() {

    // 开启单页路由
    window.router = bui.router();

    // DOM准备完毕
    bui.ready((global) => {

      // Web初始化路由
      router.init({
        id: "#bui-router",
        progress: true,
        hash: true,
        firstAnimate: false,  // 跳转动画优先
      })

      // 绑定事件
      this.bind();

    })
  },
  nativeready() {
    var that = this;
    // 安卓的初始化设备会更慢，要放在 window.onload 里面
    window.document.addEventListener("deviceready", function () {
      // 原生方法准备就绪以后 才能执行 app.xxx 之类的方法

      // 绑定物理后退按键
      that.nativeback();

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
  },
  nativeback() {
    // 绑定手机后退按键
    var flag = 0,
      quickClick = 0,
      timeout;
    try {
      document.addEventListener("backbutton", function () {

        if (router.getHistory().length > 1) {
          // 防止快速点击导致历史记录错乱
          if (quickClick == 0) {
            bui.back();
            quickClick = 1;
            //.5s后重新设置回去
            timeout = setTimeout(function () {
              quickClick = 0;
            }, 500);
          }
        } else {
          if (flag == 0) {
            bui.hint("再按一次就退出应用了!");
            flag = flag + 1;
            //2s后重新设置回去
            timeout = setTimeout(function () {
              flag = 0;
            }, 2000);
          } else if (flag == 1) {
            app.exit();
          }
        }

      }, false);
    } catch (e) { }
  }
}

// 页面开始执行
pageview.init();

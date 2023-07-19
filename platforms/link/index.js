
var pageview = {
  init:async function() {
    let that = this;
    // 获取全局配置
    let globalconfig = loader.global();

    // link 才执行，token跟路由都是异步的，所以需要比路由执行
    if( navigator.userAgent.indexOf("linkmessenger") > -1 ){
        // ios 需要在onload才能获取到一些原生信息
        await this.onLoad();
        await this.nativeready();

        // 获取token及用户信息
        let tokenResult = await this.getLinkToken();
        let userinfoResult = await this.getLinkUserInfo();
        
        // 挂载到全局模块， 模块里可以通过 global.token 获取
        globalconfig.token = tokenResult;
        globalconfig.userinfo = userinfoResult;
    }

    // 开启单页路由
    window.router = bui.router();
    // dom 初始化
    bui.ready((global)=>{

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
    return new Promise((resolve, reject) => {
        
        window.document.addEventListener("deviceready", function () {

          resolve();

        }, false);
        
    })

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
  getLinkToken() {
    // 获取用户token

    return new Promise((resolve, reject) => {
      app.link.getToken(function (result) {
        resolve(result);
      });
    })
  },
  getLinkUserInfo() {
    // 获取用户信息
    return new Promise((resolve, reject) => {
      app.link.getLoginInfo(function (result) {

        resolve(result);
      })
    })
  },
  onLoad() {
    return new Promise((resolve, reject) => {
      window.addEventListener('load', function (e) {

        resolve();
      })
    })
  }
}

// 页面开始执行
pageview.init();

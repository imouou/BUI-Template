// 获取应用实例
const app = getApp();
// bui webview类方法,用于处理bui的路由
const webview = require('../../bui/webview.js');

Page({
  data:{
    // 配置bui webapp的地址，需要配置webview的业务域名，且为https, 非https记得在详情配置不校验业务域名
    webapp:"http://localhost:10217/index.html",
    // webapp:"http://weui.io",
    // webapp:"http://api.weixin.jiaoyubao.cn/",
    // webview组件的url地址，默认为空，在onLoad里面会对url进行处理
    url:""
  },
  onShareAppMessage(options) {

    // 解析webviewurl 参数
    // 用户点击分享获取到webview分享的地址,解析对应的参数 `#pages/news/detail?id=4`
    let params = webview.getUrlParams(options.webViewUrl);

    // 分享的url为新的地址，用户打开以后，会直接打开  pages/webapp/index?module=pages/news/detail&id=4 
    // 用户打开小程序会由bui的路由解析跳转，
    // 如果需要授权，先跳转到 pages/index/index  授权后再跳转到 pages/webapp/index
    let url = webview.setUrlParams("pages/webapp/index",params);
    
    return {
      title: params.subject || params.title || "BUI",
      module: params.module,
      path: url
    }
  },
  getUserinfo(){
    // webview加载完以后触发自定义函数
  },
  postMessage(e) {
    // 接收webview jssdk 发送的消息
    console.log(e)
  },
  onLoad:function(opt){
    console.log(opt)
    // 如果从小程序页面传参给当前页，会自动解析出对应的参数，解析后设置到webview 为新的地址
    if( opt && opt.module ){
      // 拼接成合适的url地址,bui会自动进行跳转
      let url = webview.setUrlParams(this.data.webapp,opt);
      // 跳到分享的详情页
      this.setData({
        url: url
      })
    }
    else{
      // 默认打开webapp首页
      let url = webview.setUrlParams(this.data.webapp,opt);
      this.setData({
        url: url
      })
    }
  }
})
// app.js
App({
  onLaunch() {

    // 登录 如果接口需要用户信息，需要发送res.code给后台换取token，及用户的信息，webview才可以拿到用户信息。
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res.code);
    //     // wx.request({
    //     //   url: 'url',
    //     // })
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})

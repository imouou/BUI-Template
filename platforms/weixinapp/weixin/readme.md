# bui小程序webview说明

## 目录说明
比新建的微信小程序工程（2021-4-28 号），多了以下东西
|  目录   | 文件说明  |
|  ----  | ----  |
| /bui  | 新增bui的目录，存放bui相关的模块脚本 |
| /bui/webview.js  | webapp/index 模块需要用的一些方法,会自动解析URL参数实现分享 |
| /pages/webapp  | 新增 webapp 目录 |
| /pages/webapp/index.js  | 用来配置webapp的url地址 |
| /pages/webapp/index.json  | 页面的相关配置 |
| /pages/webapp/index.wxml  | 相当于html文件 |
| /pages/webapp/index.wxss  | 相当于css文件 |

如果是在已有的工程要使用bui的webapp，则可以把以上文件，复制到微信小程序工程即可。

## 使用说明

1. mp.weixin.com 注册小程序；
2. 获取小程序到appid 修改 `project.config.json`； 
```js
{
  ...
  "appid": "wx11xxxxxxxxxxxxx",
  "projectname": "bui",
  ...
}
```
3. 导入buiMiniProgram到当前工程
4. 修改 `pages/webapp/index.js` webapp的地址为远程的bui单页路由地址
5. 调试阶段，在微信开发者工具右上角，`详情->本地设置->勾选 不校验合法域名、web-view（业务域名）、TLS版本以及https证书`

## 常见问题
1. 如何修改小程序默认首页，比方需要跳转到授权？
答：把 app.json 里面的数组换个位置，小程序默认打开该数组的第一个索引路径。
```json
"pages":[
    "pages/index/index",
    "pages/webapp/index",
  ],
```

2. 个人可以使用bui这种开发方式吗？
答：不可以，小程序有较多限制，不允许个人开发者配置web-view 业务域名；

3. 公司使用bui开发webview小程序，需要提前了解哪些？
答： 
```
  1. 必须要有公司资质，需要申请公司资质的小程序；
  2. 域名必须要备案；
  3. 域名必须是https；
  4. 小程序的相关请求也需要进行配置，也就是你使用第三方的请求，没法校验域名的情况下，是不允许请求的；
  ... 其它参考小程序的官方文档。
```

目前很多互联网大厂也使用webapp结合小程序的开发方式，虽然webview开发有诸多限制，但这种开发方式，可以突破小程序的层级限制，真正的一次开发，多端适配，保持一致体验的同时，降低了开发成本，维护成本。


附录：
1. 小程序Webview说明：https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
2. 微信JS-SDK： https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
3. 微信JS-SDK Demo http://demo.open.weixin.qq.com/jssdk

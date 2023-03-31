# bui小程序webview说明

该工程主要解决BUI的单页路由分享问题, 通过该工程,上架成功的小程序, 在BUI的单页分享出去, 用户打开会自动跳转到分享的地址. 

小程序的webview开发包含两个部分, 

1. bui 工程, 负责bui自身的功能交互, 并且提供了操作微信小程序路由的能力, 部署到远程服务器;
2. weixin目录 为小程序的工程, 修改`project.config.json` 的appid 为你的小程序id, 导入到微信开发者工具, 包含了几个简单的页面, 具体请查看 `weixin/readme.md` 说明文件.
3. 修改 `weixin/pages/webapp/index.js` 里面的域名为远程服务器的域名. 

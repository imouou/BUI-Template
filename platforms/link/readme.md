# Link 开发常见问题

## 工程需要安装 Node 12+ 以上版本，建议在 node 16.x

```bash

# 安装依赖
npm install

# 运行调试，LINK扫码直接在手机操作预览
npm run dev

# 打包上架的 dist.zip
npm run build
```


## 接口跨域问题

跨域有2种处理方式；

1. 根据你的chrome版本，有不同的跨域方式，这个可以百度“打开跨域的chrome”，这种方式比较简单，不用起服务都能正常预览，缺点是不能手机调试；
2. 配置代理app.json 的方式，PC手机都能调试；

例如 接口地址为： http://www.easybui.com/demo/json/shop.json

```js
   bui.ajax({
      url:"http://www.easybui.com/demo/json/shop.json",
      data: {}
   }).then((result)=>{
      console.log(result)
   })
```

这种写法会出现跨域问题，可以通过配置 `app.json` 的 proxy 代理转发。

```js
{
   proxy: {
      "/demo": {
         "target": "http://www.easybui.com",
         "changeOrigin": true,
         "ssl": false
      }
   }
}
```

接口请求地址要变更为相对路径，所有以 demo开头的接口，都会触发代理。注意：demo/ 是关键字，且前面不能加 ”/“ <del>/demo/</del>

```js
   bui.ajax({
      url:"demo/json/shop.json",
      data: {}
   }).then((result)=>{
      console.log(result)
   })
```

为了后续上架变更为正式环境，一般会在接口前加上一个变量；

```js
   // 正式环境
   // var urlpath = "http://www.easybui.com/";
   // 跨域调试环境
   var urlpath = "";

   bui.ajax({
      url: `${urlpath}demo/json/shop.json`,
      data: {}
   }).then((result)=>{
      console.log(result)
   })
```

## 打开手机LINK调试

PC调试调用不了原生方法，需要在link环境，每次上架调试太过繁琐，link提供了一种远程的调试方式，默认不显示，需要通过以下方法打开。

- 打开link，点击用户头像
- 在用户菜单选择关于
- 快速点击版本号10次，会自动开启应用调试，
- 点击应用调试，通过扫码或者输入网址，可以调用到原生方法；

执行工程的 `npm run dev` 会在终端有一个二维码，新工程可以扫描那个二维码，直接调试。


1. 轻应用在手机Link调试，直接扫工程二维码，但有跨域问题，上架则没有。
可以采用原生方法处理。 
```js
   // 使用原生请求
   bui.config.ajax = { needNative: true }
```

## 上架问题

开发过程可能会使用到es6，如果直接上架，会导致应用空白，需要先编译，使用 `npm run build`，编译后的文件在 `dist/dist.zip` 可直接用来上架，如果你的工程没出现 dist.zip ，可以进入 dist目录，全选里面的文件，然后再用压缩软件打包 zip 即可。


注意：
LINK的扫码调试或者上架，现在需要配置以下参数，区分不同的环境，现在新版的cordova，在url后加上 `engine=cordova`，旧的用 `engine=cordova260`

例如：旧版调试 http://localhost:4141/index.html?engine=cordova260 

部分特殊定制的LINK，底层默认的是旧版的Cordova，调试新版工程需要加 `useNewCordova=1`; 上架是在启动参数那里加。

## 其他参考

1. LINK文档：http://linkdoc.bingosoft.net:8088/sidebars/bingoTouch/src/lightApp/intro.html
   LINK API文档：https://open.bingosoft.net/btapi-demo/index.html

注意：1.8.0的bui版本 不再使用 bui.isWebapp = false 来切换原生方法了，具体看index.js nativeready 方法
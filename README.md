# BUI-Template

> <strong style="color:red">重要：</strong> 1.7.5后 已经逐渐删除不常用的模板，只保留不同平台的创建，组件，模板,案例将统一从官网资源下载 

[进入官网预览模板](http://www.easybui.com/).

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


## 简介

这个模板工程文件是为了配合 [buijs](https://easybui.com/products/267.html)  命令行工具而创建.
通过安装该工具,可以快速创建或增加模板, 具体请查看 [buijs使用说明](https://easybui.com/products/267.html) .
> 通过命令行构建的工程,每次都会自动获取最新的BUI模板工程, 并且可以指定模板名称及指定平台.

![buijs 创建工程预览](https://easybui.com/uploads/20220826/3a8f49214a3a6454bb2db702adda8279.png)

## 创建某个模板工程

可以先查看有什么模板 `buijs list-template`, [BUI模板图片预览](https://easybui.com/products/268.html)

```bash
# 进入工程目录
$ cd demo

# 默认创建webapp工程模板
$ buijs create -t main-tab

```
> main-tab 为模板名称

> <strong style="color:red">注意:</strong>
1. 同一个工程可以多次创建模板;
模板名以 `main-`开头 会覆盖 main 模块, 例如: 模板名 `main-tab` 预览地址 `index.html`;
模板名以 `page-`开头 会新增页面, 例如: 模板名 `page-login` 预览地址 `index.html#pages/login/login`;
**1.6.x 新增** 废弃，导致工程包过大
模板名以 `case-`开头 会覆盖工程, 例如: 模板名 `case-login` 预览地址 `index.html`;
2. `main-`开头的模板会覆盖main页面, `page-`开头的模板是新增页面, `case-`开头是一个完整的小案例;
3. 同一个工程只能创建一个平台, 多次创建会相互覆盖;

更多 [buijs使用说明](https://easybui.com/products/267.html) ;

# 模板预览


## 覆盖main模块的模板
- main-tab: tab底部动态加载
- main-tab-head: tab顶部动态加载Component
- main-tab-side: tab侧边动态加载Component


| ![](https://www.easybui.com/uploads/20230209/e259c148b8fa9b8571e0c89f52e13ba3.png) | ![](https://www.easybui.com/uploads/20230209/b3cce1a04faac1d3201fdb86576d75e8.png) | ![](https://www.easybui.com/uploads/20230209/1fcea82fc7fadb196e912b170d14d278.png) |
| :--------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|                                   模板: main-tab                                   |                                模板: main-tab-head                                 |                                模板: main-tab-side                                 |


## 新增页面模板


| ![](https://easybui.com/uploads/20220824/28788a0fe609853be0fad57c26b6a677.png) | ![](https://easybui.com/uploads/20220824/7a16b301cceb65bd54fa6c54d2247e6c.png) | ![](https://easybui.com/uploads/20220824/c8897e3d3b35d173fea835ca2d29f2d1.png) |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                                模板: page-login                                |                                模板: page-form                                 |                                 模板: page-msg                                 |

| ![](https://easybui.com/uploads/20220824/c9df20a6d3c1c22df62dd601632585d8.png) | ![](https://easybui.com/uploads/20220824/b2e3132554c10b9cc05e21ad63cdbbad.png) | ![](https://www.easybui.com/uploads/20230209/60ac52b680bad5ef294e981451b60f74.png) |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
|                                模板: page-list                                 |                               模板: page-search                                |                                 模板: page-article                                 |



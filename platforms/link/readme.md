# Link 开发常见问题

 1. 轻应用在PC调试时，请搜索打开跨域的chrome，或者配置 app.json 的方式，具体查看文档
 2. 轻应用在手机Link调试也会有跨域问题，上架则没有
 3. LINK的扫码调试或者上架，需要加上以下参数，区分不同的环境，现在新版的LINK 用 engine=cordova，旧的用 engine=cordova260
    例如：旧版调试 http://localhost:4141/index.html?engine=cordova
 4. 上架或者调试，部分ES6会导致应用空白，需要先编译，使用 npm run build 一次。
 5. LINK文档：http://linkdoc.bingosoft.net:8088/sidebars/bingoTouch/src/lightApp/intro.html
    LINK API文档：https://open.bingosoft.net/btapi-demo/index.html

注意：1.8.0的bui版本 不再使用 bui.isWebapp = false 来切换原生方法了，具体看index.js nativeready 方法
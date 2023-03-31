# Cordova开发步骤

0. 创建bui cordova工程 `buijs create buiapp -p cordova`
1. 剪切 `src/config.xml, src/package.json, src/www, src/gulpfile.js` 4个文件到根目录覆盖
2. 全局安装 `npm install -g cordova`
3. 增加需要的原生插件 `cordova platform add browser device bar code` ,安装插件前请先 删除 package-lock.json 
4. 安装bui工程需要的依赖 `npm install && npm run dev`, 安装插件前请先 删除 package-lock.json 
5. BUI只负责当前的UI构建，打包及使用Cordova原生插件，请查看Cordova官方文档  https://cordova.apache.org/
6. 打包前请确认 bui.isWebapp = false, 才能调用到原生方法，相当于 deviceready 
7. 打包前请先执行 npm run build ，会把es6编译成es5 
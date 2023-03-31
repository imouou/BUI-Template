# Dcloud 开发说明

1. 创建bui dcloud工程 `buijs create buiapp -p dcloud`
2. BUI只负责当前的UI构建，打包及使用原生插件，请查看Dcloud官方文档 https://www.html5plus.org/doc/zh_cn/accelerometer.html
5. 用Hbuildx 新建一个 HTML5+ 的应用工程
3. 打包前请确认 bui.isWebapp = false, 才能调用到原生方法
4. 打包前请先执行 npm run build ，会把es6编译成es5 生成 dist 目录
5. 把dist/ 里面的文件，覆盖到 Hbuildx 工程
6. 在Hbuildx里面就可以打包
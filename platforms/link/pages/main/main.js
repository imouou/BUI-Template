/**
 * 首页模块
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (requires, exports, module, global) {
    // 合并接收默认参数
    let props = $.extend(true, {}, module.props);


    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "main",
        data: {
            title: "BUI 组件共享 快速开发",
        },
        methods: {
            getToken() {

                bui.alert(global.token)
            },
            getData() {
                // 请求测试地址
                bui.ajax({
                    url: "https://easybui.com/demo/json/shop.json",
                    data: {},//接口请求的参数
                    // 可选参数
                    method: "GET"
                }).then(function (result) {
                    // 成功
                    bui.alert(result);
                }, function (result, status) {
                    // 失败 console.log(status)
                    bui.alert("PC调试请打开跨域的Chrome，LINK调试，需要使用代理，或者切换成原生请求，查看 src/index.js 的注释说明");
                });
            },
            getApp() {
                // 获取应用信息
                app.getInfo(function (res) {
                    var html = '应用信息';
                    for (var key in res) {
                        html += key + ':' + res[key] + '\n'
                    }
                    bui.alert(html)
                });
            },
            getUserinfo() {
                // 获取用户登录信息
                app.link.getLoginInfo(function (res) {
                    bui.alert(res)
                });
            },
            recordVideo() {
                // 视频录制
                app.link.captureVideo((mediaFiles) => {
                    var i, path, len, filePath, fileName;
                    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                        path = mediaFiles[i].fullPath;
                        filePath = path;
                        fileName = mediaFiles[i].name;
                        bui.alert("success\n" +
                            "name：" + mediaFiles[i].name + "\n" +
                            "size：" + mediaFiles[i].size + "\n" +
                            "localURL：" + mediaFiles[i].localURL + "\n" +
                            "fullPath：" + path);
                    }
                }, (error) => {
                    bui.alert('error' + error);
                }, {
                    duration: 4
                })
            }
        },
        watch: {},
        computed: {},
        templates: {
        },
        mounted: function () {
            // 数据解析后执行
        }
    })

    return bs;
})
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
            scan() {
                bui.load({ url: "pages/scan/demo.html", param: {} });
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
                    bui.alert("PC调试请打开跨域的Chrome，Dcloud请使用真机调试");
                });
            },
            getApp() {
                try {
                    // 获取设备信息
                    plus.device.getInfo({
                        success: function (e) {
                            bui.alert(e);
                        },
                        fail: function (e) {
                            bui.alert(e);
                        }
                    });
                } catch (e) {
                    console.log("原生方法请在Hbuildx调试")
                }
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
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
            desc: "Webapp、混合App、小程序、公众号",
            features: [{
                title: "开箱零配置",
                desc: "路径式组件，路由零配置",
                icon: "https://www.easybui.com/static/images/features/icon1.png"
            }, {
                title: "轻量高复用",
                desc: "轻量化，按需加载组件",
                icon: "https://www.easybui.com/static/images/features/icon2.png"
            }, {
                title: "简单快定制",
                desc: "简单定制1:1模板组件",
                icon: "https://www.easybui.com/static/images/features/icon3.png"
            }, {
                title: "跨平台适配",
                desc: "一次开发，跨平台全适配",
                icon: "https://www.easybui.com/static/images/features/icon4.png"
            }]
        },
        methods: {
            getData() {
                // 全局的请求，在 js/global.js 定义，会根据环境自动选择
                global.ajax({
                    url: "demo/json/shop.json", // PC调试可以把URL改成这个，app.json 默认配置了代理，demo开头的请求都会转发出去
                    // url: "http://www.easybui.com/demo/json/shop.json", // 远程地址要开启跨域的Chrome，或者打包上架才能访问
                    data: {},//接口请求的参数
                    // 可选参数
                    method: "GET",
                }).then(function (result) {
                    // 成功
                    bui.alert(result);
                }, function (result) {
                    if( navigator.userAgent.indexOf("linkmessenger") > -1 && bui.currentPlatform == "link" ){
                        bui.alert("请查看js/global.js 的注释，去掉注释可在LINK调试");
                    }else{
                        bui.alert("PC调试请打开跨域的chrome，或使用代理，具体查看文档说明 ");
                    }
                });
            },
            hint(content){
                // 获取跨域数据
                global.hint(content);
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplFeatures(data) {
                let html = "";
                data.forEach((item, index) => {
                    html += `<li class="span1">
                    <div class="bui-pic">
                        <div class="icon"><img src="${item.icon}" alt=""></div>
                        <div class="bui-pic-title">${item.title}</div>
                    </div>
                </li>`
                })

                return html;
            }
        },
        mounted: function () {
            // 数据解析后执行
        }
    })

    return bs;
})
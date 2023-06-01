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
        methods: {},
        watch: {},
        computed: {},
        templates: {
            tplFeatures(data) {
                let html = "";
                data.forEach((item, index) => {
                    html += `<li class="span1">
                    <div class="bui-pic">
                        <div class="bui-pic-img"><img src="${item.icon}" alt=""></div>
                        <div class="bui-pic-title">${item.title}</div>
                        <div class="bui-pic-desc bui-text-hide">${item.desc}</div>
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
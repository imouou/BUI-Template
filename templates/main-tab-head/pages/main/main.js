/**
 * 底部导航TAB模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (requires, exports, module, global) {

    var navconfig = [{
        id: "tab0",
        icon: "icon-home",
        title: "首页",
        name: "pages/main/home",
        param: { type: "news" }
    }, {
        id: "tab1",
        icon: "icon-menu",
        title: "分类",
        name: "pages/main/category",
        param: { type: "photo" },
        everytime: true
    },
    {
        id: "tab2",
        icon: "icon-pic",
        title: "图片",
        name: "pages/main/photo",
        param: { type: "video" }
    }, {
        id: "tab3",
        icon: "icon-user",
        title: "个人",
        name: "pages/main/personal",
        param: { type: "class" }
    }
    ];

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "main",
        data: {
            title: "首页",
        },
        methods: {
            tab(opt) {

                let that = this;
                var uiTab = bui.tab({
                    id: "#uiTab",
                    position: "top",
                    iconPosition: "left",
                    data: opt.data
                })

                uiTab.on("to", function () {
                    let index = this.index();
                    let item = opt.data[index];
                    // 没次切换赋值
                    that.title = item.title;
                })

                return uiTab;
            }
        },
        watch: {},
        computed: {},
        templates: {},
        mounted: function () {
            // 数据解析后执行
            this.tab({
                data: navconfig
            });
        }
    })

    // 输出模块
    return bs;

})
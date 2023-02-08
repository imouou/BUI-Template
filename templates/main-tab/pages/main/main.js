/**
 * 底部导航TAB模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (requires, exports, module, global) {

    var pageview = {
        init: function () {
            this.tab();
        },
        tab: function () {

            var uiTab = bui.tab({
                id: "#uiTab",
                position: "bottom",
                iconPosition: "top",
                data: [{
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
                ]
            })
        }
    };


    // 初始化
    pageview.init();

    // 输出模块
    return pageview;

})
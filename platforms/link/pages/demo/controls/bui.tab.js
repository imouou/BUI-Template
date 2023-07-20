loader.define(function(requires,exports,module,global){

    // html:
    // <div id="uiTab" class="bui-tab"></div>
    var uiTab = bui.tab({
        id: "#uiTab",
        position: "bottom",
        iconPosition: "top",
        data: [{
                id: "uiTab0",
                icon: "icon-home",
                title: "首页",
                name: "pages/demo/components/list/index",
                param: { classify: "news" }
            }, {
                id: "uiTab1",
                icon: "icon-menu",
                title: "分类",
                name: "pages/demo/components/list/index",
                param: { classify: "photo" },
            }
        ]
    })
})
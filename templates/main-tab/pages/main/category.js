loader.define(function(require, exports, module) {

    var pageview = {
        init: function() {
            this.tab();
        },
        tab: function() {
            var uiTab = bui.tab({
                id: "#uiTabHome",
                position: "left",
                iconPosition: "left",
                sideWidth: 80,
                data: [{
                        id: "hometab0",
                        title: "热销榜",
                        name: "pages/components/list/index",
                        param: { type: "hot" }
                    }, {
                        id: "hometab1",
                        title: "主食",
                        name: "pages/components/list/index",
                        param: { type: "main" },
                        everytime: true
                    },
                    {
                        id: "hometab2",
                        title: "超值套餐",
                        name: "pages/components/list/index",
                        param: { type: "package" }
                    }, {
                        id: "hometab3",
                        title: "汤品",
                        name: "pages/components/list/index",
                        param: { type: "drink" }
                    }
                ]
            })
        }
    }

    pageview.init();

})
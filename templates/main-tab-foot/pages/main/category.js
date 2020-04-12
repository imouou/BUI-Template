loader.define(function(require, exports, module) {

    var pageview = {
        init: function() {
            this.tab();
        },
        tab: function() {
            var tabWidth = $(window).width() - $("#tabSideNav").width();

            //按钮在tab外层,需要传id
            var tab = bui.tab({
                id: "#tabSide",
                menu: "#tabSideNav",
                width: tabWidth,
                direction: "y",
                animate: false
            })
        }
    }

    pageview.init();

})
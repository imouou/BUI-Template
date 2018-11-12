/**
 * 表单模板
 * 默认模块名: pages/page-login/page-login
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var pageview = {};
    
    pageview.bind = function () {
        
    }

    pageview.init = function () {

        // 菜单初始化
        var uiSlideNav = bui.slide({
            id:"#slideIcon",
            height:400,
            autopage: true,
            zoom: true
        });
    }

    // 初始化
    pageview.init();

    // 输出模块
    module.exports = pageview;
})
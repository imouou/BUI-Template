// 默认已经定义了main模块
loader.define(function(require,exports,module) {

    var tab = bui.slide({
        id:"#tabMain",
        menu:"#tabMainNav",
        children:".bui-tab-main ul",
        scroll: true,
        animate: false,
        autoload: true,
    })

    // 2: 监听加载后的事件, load 只加载一次
    tab.on("load",function (res) {
        var index = $(this).index();
        switch(index){
            case 0:
            loader.require(["pages/main/home"])
            break;
            case 1:
            loader.require(["pages/main/news"])
            break;
            case 2:
            loader.require(["pages/main/photo"])
            break;
            case 3:
            loader.require(["pages/main/setting"])
            break;
        }
    })

     // 让顶部导航滚动到可视位置, 如果导航平分宽度,可以注释掉
     tab.on("to",function (index) {
        var left = $("#tabMainNav li")[index].offsetLeft;
        document.getElementById("tabMainNavbar").scrollLeft = left;
     })
})
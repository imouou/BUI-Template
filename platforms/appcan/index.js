// 开启单页路由
window.router = bui.router();

// DOM准备完毕
bui.ready(function() {

    // 初始化路由, appcan不支持历史记录,所以这里syncHistory需要设置为false.
    router.init({
        id: "#bui-router",
        progress: true,
        syncHistory: false,
        hash: true,
    })

    // 绑定事件
    bind();

    function bind() {
        // 绑定页面的所有按钮有href跳转
        bui.btn({ id: "#bui-router", handle: ".bui-btn,a" }).load();

        // 统一绑定页面所有的后退按钮
        $("#bui-router").on("click", ".btn-back", function(e) {
            // 支持后退多层,支持回调
            bui.back();
        })
    }
})

/*-----------------------------------------
 打包需要设置去掉注释
-------------------------------------------*/

/*----------------------------------------
// 原生方法
appcan.ready(function() {
    // 拦截后退按键
    bindBack();
});

// 绑定手机后退按键
function bindBack() {
    // 监听后退按钮
    var flag = 0,
        quickClick = 0,
        timeout;
    try {

        var isAndroid = bui.platform.isAndroid();
        //如果是Android平台，则监听返回按钮事件
        if (isAndroid) {
            // 拦截后退按键
            uexWindow.setReportKey(0, 1);
            uexWindow.onKeyPressed = function(keyCode) {
                if (keyCode == 0) {
                    if (router.getHistory().length > 1) {
                        // 防止快速点击导致历史记录错乱
                        if (quickClick == 0) {
                            bui.back();
                            quickClick = 1;
                            //.5s后重新设置回去
                            timeout = setTimeout(function() {
                                quickClick = 0;
                            }, 500);
                        }
                    } else {
                        if (flag == 0) {
                            bui.hint("再按一次就退出应用了!");
                            flag = flag + 1;
                            //2s后重新设置回去
                            timeout = setTimeout(function() {
                                flag = 0;
                            }, 2000);
                        } else if (flag == 1) {
                            // 退出应用
                            uexWidgetOne.exit(0);
                            // 隐藏到后台
                            // uexWidget.moveToBack();
                        }
                    }
                }
            }
        }

    } catch (e) {}
}
-------------------------------------------*/

/**
 * 聊天对话模板
 * 默认模块名: pages/chat/chat
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(requires, exports, module) {

    var pageview = {
            init: function() {
                this.bind();
            },
            bind: function() {
                // 发送的内容
                var $chatInput = router.$("#chatInput"),
                    // 发送按钮
                    $btnSend = router.$("#btnSend"),
                    // 聊天的容器
                    $chatPanel = router.$(".chat-panel");

                // 绑定发送按钮
                $btnSend.click(function(e) {
                    var val = $chatInput.val();
                    var tpl = chatTpl(val);

                    if (!$(this).hasClass("disabled")) {
                        $chatPanel.append(tpl);
                        $chatInput.val('');
                        $(this).removeClass("primary").addClass("disabled");
                    } else {
                        return false;
                    }
                });

                // 延迟监听输入
                $chatInput.on("input", bui.unit.debounce(function() {
                    var val = $chatInput.val();
                    if (val) {
                        $btnSend.removeClass("disabled").addClass("primary");

                    } else {
                        $btnSend.removeClass("primary").addClass("disabled");

                    }
                }, 100))

                var interval = null;
                var count = 3;
                // 安卓键盘弹出的时间较长;
                var time = bui.platform.isIos() ? 200 : 400;
                // 为input绑定事件
                $chatInput.on('focus', function() {

                    var agent = navigator.userAgent.toLowerCase();
                    interval = setTimeout(function() {
                        if (agent.indexOf('safari') != -1 && agent.indexOf('mqqbrowser') == -1 &&
                            agent.indexOf('coast') == -1 && agent.indexOf('android') == -1 &&
                            agent.indexOf('linux') == -1 && agent.indexOf('firefox') == -1) {
                            //safari浏览器
                            window.scrollTo(0, 1000000);
                            setTimeout(function() {
                                window.scrollTo(0, window.scrollY - 45);
                            }, 50)

                        } else {
                            //其他浏览器
                            window.scrollTo(0, 1000000);
                        }

                    }, time);
                }).on('blur', function() {
                    if (interval) {
                        clearTimeout(interval);
                    }

                    var agent = navigator.userAgent.toLowerCase();
                    interval = setTimeout(function() {
                        if (!(agent.indexOf('safari') != -1 && agent.indexOf('mqqbrowser') == -1 &&
                                agent.indexOf('coast') == -1 && agent.indexOf('android') == -1 &&
                                agent.indexOf('linux') == -1 && agent.indexOf('firefox') == -1)) {
                            //safari浏览器
                            window.scrollTo(0, 30);
                        }
                    }, 0);
                });

                // 聊天模板
                var chatTpl = function(con, type) {
                    var html = "";
                    var type = type || 0;
                    switch (type) {
                        case 0:
                            html += `<div class="bui-box-align-top chat-mine">
                        <div class="span1">
                            <div class="bui-box-align-right">
                                <div class="chat-content bui-arrow-right">
                                 ${con}
                                </div>
                            </div>
                        </div>
                        <div class="chat-icon"><img src="images/applogo.png" alt=""></div>
                    </div>`
                            break;
                        case 1:
                            html += `<div class="bui-box-align-top chat-mine">
                        <div class="span1">
                            <div class="bui-box-align-right">
                                <div class="chat-content bui-arrow-right">
                                 ${con}
                                </div>
                            </div>
                        </div>
                        <div class="chat-icon"><img src="images/applogo.png" alt=""></div>
                    </div>`
                            break;
                    }

                    return html;
                }
            }
        }
        // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
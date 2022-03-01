/**
 * 注册模板,包含验证码倒计时及手机号简单验证
 * 默认模块名: pages/register/register
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(requires, exports, module) {

    var pageview = {
        init: function() {

            // 手机号,帐号是同个样式名, 获取值的时候,取的是最后一个focus的值
            var userInput = bui.input({
                id: ".user-input",
                callback: function(e) {
                    // 清空数据
                    this.empty();
                }
            })

            // 密码显示或者隐藏
            var password = bui.input({
                id: "#passwordInput",
                iconClass: ".icon-eye",
                onBlur: function(e) {

                    if (e.target.value == '') { return false; }
                    // 注册的时候校验只能4-18位密码
                    var rule = /^[a-zA-Z0-9_-]{4,18}$/;
                    if (!rule.test(e.target.value)) {
                        bui.hint("密码只能由4-18位字母或者数字上下横杠组成");
                        return false;
                    }

                    return true;
                },
                callback: function(e) {
                    //切换类型
                    this.toggleType();
                    //
                    $(e.target).toggleClass("active")
                }
            })

            // 验证码示例
            var $btnSend = $("#btnSend");
            var timer = bui.timer({
                onEnd: function() {
                    $btnSend.removeClass("disabled").text("重新获取验证码");
                },
                onProcess: function(e) {
                    var valWithZero = e.count < 10 ? "0" + e.count : e.count;
                    $btnSend.text(valWithZero + "后重新获取");
                },
                times: 10
            });

            $btnSend.click(function(argument) {
                var hasDisabled = $(this).hasClass("disabled");
                if (!hasDisabled) {
                    $(this).addClass("disabled")
                    bui.hint("验证码发送成功")
                    timer.restart();
                }
            })
        }
    };

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
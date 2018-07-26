/**
 * 聊天对话模板
 * 默认模块名: pages/chat/chat
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {
    
    var pageview = {};
    
    // 模块初始化定义    
    pageview.init = function () {
        this.bind();
    }
    pageview.bind = function () {
            // 发送的内容
        var $chatInput = $("#chatInput"),
            // 发送按钮
            $btnSend = $("#btnSend"),
            // 聊天的容器
            $chatPanel = $(".chat-panel");

        // 绑定发送按钮
        $btnSend.on("click",function (e) {
            var val = $chatInput.val();
            var tpl = chatTpl(val);

            if( !$(this).hasClass("disabled") ){
                $chatPanel.append(tpl);
                $chatInput.val('');
                $(this).removeClass("primary").addClass("disabled");
            }else{
                return false;
            }
        });

        // 延迟监听输入
        $chatInput.on("input",bui.unit.debounce(function () {
            var val = $chatInput.val();
            if( val ){
                $btnSend.removeClass("disabled").addClass("primary");
                
            }else{
                $btnSend.removeClass("primary").addClass("disabled");

            }
        },100))

        // 为input绑定事件
        $('.bui-input').on('click', function () {

            // 使用定时器是为了延迟计算
            setTimeout(function(){
                bui.init({
                    id: router.$(".bui-page")
                })

              router.$(".bui-page")[0].scrollIntoView();

            },300);
        });
        $('#chatInput').on('blur', function () {
            // 使用定时器是为了延迟计算
            setTimeout(function(){
                bui.init({
                    id: router.$(".bui-page")
                })

              router.$(".bui-page")[0].scrollIntoView();

            },300);
        });
    }

    // 聊天模板
    var chatTpl = function (con,type) {
        var html = "";
        var type = type || 0;
        switch(type){
            case 0: 
            html+='<div class="bui-box-align-top chat-mine">';
            html+='    <div class="span1">';
            html+='        <div class="bui-box-align-right">';
            html+='            <div class="chat-content bui-arrow-right">';
            html+=              con;
            html+='            </div>';
            html+='        </div>';
            html+='    </div>';
            html+='    <div class="chat-icon"><img src="../images/applogo.png" alt=""></div>';
            html+='</div>';
            break;
            case 1: 
            html +='<div class="bui-box-align-top chat-target">';
            html +='    <div class="chat-icon"><img src="../images/applogo.png" alt=""></div>';
            html +='    <div class="span1">';
            html +='        <div class="chat-content bui-arrow-left">';
            html +=             con;
            html +='        </div>';
            html +='    </div>';
            html +='</div>';
            break;
        }

            return html;
    }

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
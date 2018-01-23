/**
 * 注册模板,包含验证码倒计时及手机号简单验证
 * 默认模块名: pages/page-list/page-list
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var pageview = {};
    
    pageview.bind = function () {
        

        // 监听密码输入事件
        onInput({
            id: ".code-input",
            callback: function () {
                // 点击删除按钮清空
                $("#code").val('');
                $(this).hide();
            }
        });

        // 监听密码输入事件
        onInput({
            id: ".phone-input",
            callback: function () {
                // 点击删除按钮清空
                $("#phone").val('');
                $(this).hide();
            }
        });

        // 点击触发倒计时
        $(".btn-send").on("click",function () {
            var isDisable = $(this).hasClass("disabled");
            var phone = $("#phone").val();
            if( !isDisable && checkPhone(phone) ){
                $(this).addClass("disabled");

                if( timeout ){
                    clearTimeout(timeout);
                }
                countdown.call(this);
            }
        })

    }

    pageview.init = function () {

        // 绑定事件
        this.bind();
    }

    /**
     * [countnum 倒计时]
     * @type {Number}
     */
    var countnum = 60,
        timeout; 
    function countdown(_self) { 
        _self = _self || this;
        var arg = arguments;

        var $this = $(_self);

        if (countnum == 0) { 
            $this.removeClass("disabled");    
            $this.text("获取验证码"); 
            countnum = 60;

            clearTimeout(timeout);

            return;
        } else { 
            $this.addClass("disabled"); 
            $this.text("重新发送(" + countnum + ")"); 
            countnum--; 
        }

        // 自执行
        timeout = setTimeout(function() { 
            arg.callee(_self) 
        },1000) 
    } 
    /**
     * [onInput 监听input事件]
     * @param  {[object]} opt [description]
     * @param  {[string]} opt.id [事件的父级]
     * @param  {[string]} opt.target [目标是input]
     * @param  {[string]} opt.target [目标的input]
     * @example  
     * 
     * html: 
      
        <div class="bui-input password-input">
            <input id="password" type="password" placeholder="密码">
        </div>

       js: 

        onInput({
            id: ".password-input",
            callback: function () {
                // 点击删除按钮清空
                $("#password").val('');
                $(this).hide();
            }
        })
     * 
     * @return {[type]}     [description]
     */
    function onInput(opt) {
        var opt = opt || {};
            opt.id = opt.id || "";
            opt.target = opt.target || "input";
            opt.event = opt.event || "keyup";
            opt.icon = opt.icon || "icon-remove";
            opt.onInput = opt.onInput || function () {};
            opt.callback = opt.callback || function () {};

        if( opt.id == "" || opt.id === null ){
            return;
        }
        var $id = $(opt.id),
            $target = $id.find(opt.target);
            iconClass = '.'+opt.icon;

        // 输入框监听延迟执行
        $target.on(opt.event,bui.unit.debounce(function () {
            var val = $(this).val(),
                $btnRemove = $id.find(iconClass);
            if(val.length > 0){
                if( $btnRemove && $btnRemove.length ){
                    $btnRemove.css("display","block");
                }else{
                    $id.append('<i class="'+opt.icon+'"></i>');
                    $btnRemove = $target.find(iconClass);
                }
            }else{
                $btnRemove && $btnRemove.css("display","none");
            }

            opt.onInput && opt.onInput.call(this,val);
        },100))

        // 图标点击事件
        $id.on("click",iconClass,function () {
            opt.callback && opt.callback.call(this);
        })
    }

    // 检查手机号
    function checkPhone(val) {
        var myreg = /^(((11[0-9]{1})|(12[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/; 
        if(myreg.test(val)) 
        { 
            return true; 
        }else{
            bui.hint('请输入有效的手机号码！'); 

            return false;
        }
    }

    // 初始化
    pageview.init();

    // 输出模块
    module.exports = pageview;
})
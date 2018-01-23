/**
 * 通用登录模板,包含输入交互,提交需要自己绑定验证
 * 默认模块名: pages/page-login/page-login
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var pageview = {};
    
    pageview.bind = function () {
        
        // 监听用户名输入事件
        onInput({
            id: ".user-input",
            callback: function () {
                // 点击删除按钮清空
                $(".user-input input").val('');
                $(this).hide();
            }
        })

        // 监听密码输入事件
        onInput({
            id: ".password-input",
            callback: function () {
                // 点击删除按钮清空
                $("#password").val('');
                $(this).hide();
            }
        })
    }

    pageview.init = function () {

        // 绑定事件
        this.bind();
    }

    /**
     * [onInput 监听input事件]
     * @param  {[object]} opt [description]
     * @param  {[string]} opt.id [事件的父级]
     * @param  {[string]} opt.target [目标是input]
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

    // 初始化
    pageview.init();

    // 输出模块
    module.exports = pageview;
})
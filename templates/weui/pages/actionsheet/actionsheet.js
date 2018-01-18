loader.define(function(require,exports,module) {
    // 示例
    var uiActionsheet = bui.actionsheet({
        trigger: "#btnOpen",
        buttons: [{ name:"分享到微博",value:"weibo" },{ name:"分享到微信",value:"weixin" },{ name:"分享到QQ",value:"QQ" }],
        callback: function (e,ui) {
            
            var val = $(this).attr("value");

            console.log(val);
            if( val == "cancel"){
                ui.hide();
            }
        }
    })
    
    
    return {};
})
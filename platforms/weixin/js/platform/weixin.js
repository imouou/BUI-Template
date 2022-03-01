// 示例
/*  在index.html 引入 weixin.js 
	
	bui.ready(function(){
	    loader.require("weixin",function(weixin){
	        var userinfo = weixin.getUserinfo();
	    })
	})
    或者
	// 模块的使用
	loader.define(["weixin"],function(weixin,require,export,module){
	    // 加载某个模块
	    var userinfo = weixin.getUserinfo();
	})
	
*/
loader.define("weixin", function(requires, exports, module) {

    var uiStorage = bui.storage();

    var pageview = {
        oauthUrl: "https://xxxx.com/api", // 认证的域名
        appid: "wx9ee701a8ff89",
        scope: "snsapi_userinfo", // snsapi_userinfo || snsapi_base
        userinfo: uiStorage.get("userinfo", 0),
        checkWxLogin: function() {
            var that = this;
            // 只在微信里才检测授权
            if (bui.platform.isWeiXin()) {
                let code = bui.getUrlParam("code");
                if (code) {
                    // 通过获取wxuserinfo
                    this.getUser(code);
                } else {
                    var prevurl = window.location.href;
                    // 单页开发里, 默认会有#号, 会影响授权
                    var url = prevurl.split("#")[0];
                    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${that.appid}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=${that.scope}&state=STATE#wechat_redirect`;
                }
            }
        },
        getUser: function(code) {
            let that = this;
            // 把code传给认证的接口来获取授权信息
            $.ajax({
                type: 'GET',
                url: this.oauthUrl,
                dataType: 'json',
                data: {
                    code: code
                },
                success: function(data) {
                    that.userinfo = data;
                    // 请求成功以后把信息存储
                    uiStorage.set("userinfo", data);
                },
                error: function(error) {}
            })
        },
        getUserinfo: function() {
            if (this.userinfo) {
                return this.userinfo;
            } else {
                this.checkWxLogin();
            }
        }
    };

    return pageview;
})
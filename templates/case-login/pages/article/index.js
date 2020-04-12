loader.define(function(require,exports,module){

    var pageview = {};

		pageview.init = function () {
			// 绑定分享
			var uiActionsheet = bui.actionsheet({
			    trigger: ".btn-share",
			    buttons: [{ name:"分享到微博",value:"weibo" },{ name:"朋友圈",value:"pyq" }],
			    callback: function (e) {
			        var val = $(e.target).attr("value");
			        if( val == "cancel"){
			            this.hide();
			        }
			    }
			})
		}

		pageview.init();

    return pageview;
})

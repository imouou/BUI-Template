/**
 * 朋友圈
 * 默认模块名: pages/blog/blog
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require, exports, module) {

    // 接收url传参
    var pageParams = router.getPageParams();

    var pageview = {
        init: function(opt) {

            // 绑定展开更多内容
            this.showMore();

            this.dialog = bui.dialog({
                id: "#uiDialog",
                fullscreen: true,
                mask: false,
            });

            this.dialog.on("open", function() {
                pageview.slide.init();
            })

            // 初始化焦点图
            this.slide = bui.slide({
                id: "#slide",
                height: 380,
                autopage: true,
                fullscreen: true
            })

            var uiDropdown = bui.dropdown({
                id: ".dropdown-comment",
                data: [{
                    name: "点赞",
                    value: "点赞"
                }, {
                    name: "评论",
                    value: "评论"
                }],
                position: "left",
                change: false,
                relative: false,
                callback: function(e) {
                    var index = $(e.target).index();

                    // 打分
                    switch (index) {
                        case 0:
                            bui.hint("点赞成功")
                            break;
                        case 1:
                            pageview.showPost();
                            bui.init();
                            // 评论
                            break;
                    }
                }
            });

        },
        bind: function() {

            // 为图片绑定点击事件,触发对话框展示
            router.$(".container-full").on("click", ".span1", function() {
                var index = $(this).index();
                pageview.dialog.open();
                pageview.slide.to(index, "none");
            })
        },
        showMore: function() {
            router.$(".bui-btn-toggle").on("click", function() {
                var $target = $(this).prev(".comment-content");
                if ($target.hasClass("active")) {
                    $(this).text("展开")
                } else {
                    $(this).text("收起")
                }
                $target.toggleClass("active")
            })
        },
        showPost: function() {
            router.$(".comment-post").show();
        },
        hidePost: function() {
            router.$(".comment-post").hide();
        }
    };

    pageview.init();
    // 输出模块
    return pageview;
})
/**
 * 发布评论模块
 * 默认模块名: pages/comment/comment
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(uiList, require, exports, module) {

    var pageview = {
        init: function() {
            // 长度限制
            var comment = bui.input({
                id: "#feedback",
                target: "textarea",
                showIcon: false,
                maxLength: 500,
                showLength: true
            })

            // 上传初始化
            this.upload();
        },
        upload: function() {
            // 拍照上传
            var photos = $("#buiPhoto");
            var uiUpload = bui.upload();


            // 上拉菜单 js 初始化:
            var uiActionsheet = bui.actionsheet({
                trigger: "#btnUpload",
                buttons: [{ name: "拍照上传", value: "camera" }, { name: "从相册选取", value: "photo" }],
                callback: function(e) {
                    var ui = this;
                    var val = $(e.target).attr("value");
                    switch (val) {
                        case "camera":
                            ui.hide();
                            uiUpload.add({
                                "from": "camera",
                                "onSuccess": function(val, data) {
                                    // 展示本地图片
                                    this.toBase64({
                                        onSuccess: function(url) {
                                            photos.prepend(templatePhoto(url))

                                        }
                                    });

                                    // 也可以直接调用start上传图片
                                }
                            })

                            break;
                        case "photo":
                            ui.hide();
                            uiUpload.add({
                                "from": "",
                                "onSuccess": function(val, data) {
                                    // 展示本地图片
                                    this.toBase64({
                                        onSuccess: function(url) {
                                            photos.prepend(templatePhoto(url))
                                        }
                                    });
                                    // 也可以直接调用start上传图片
                                }
                            })

                            break;
                        case "cancel":
                            ui.hide();
                            break;
                    }
                }
            })

            function templatePhoto(url) {
                return `<div class="span1">
                        <div class="bui-upload-thumbnail"><img src="${url}" alt="" /></div>
                    </div>`
            }

        }
    };

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
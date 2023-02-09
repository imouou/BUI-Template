/**
 * 表单模板
 * 默认模块名: pages/form/form
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (requires, exports, module, global) {
    var citySelect = null;

    // 初始化数据行为存储
    var bs = bui.store({
        scope: "page",
        data: {
            view: {
                id: "44058319000101XXXX",
                name: "王小o",
                phone: "13800138000",
                mail: "XXX@qq.com",
                company: "广州xxx公司"
            },
            form: {
                comment: "",
                range: 10,
                custom: "",
                num: 1,
                area: "",
                city: "",
                birthday: "",
                speed: "",
                interest: "",
                sex: "",
                sex2: "",
                bluetooth: "bluetooth",
                fav: "fav",
                toggle: "ON",
            },
            login: {
                phone: "",
                password: "",
                code: "",
            }
        },
        methods: {
            submit: function () {
                console.log(this.$data.form)
            },
            loginInit: function () {
                // 手机号,帐号是同个样式名, 获取值的时候,取的是最后一个focus的值
                var userInput = bui.input({
                    id: ".user-input",
                    callback: function (e) {
                        // 清空数据
                        this.empty();
                    }
                })

                // 密码显示或者隐藏
                var password = bui.input({
                    id: "#passwordInput",
                    iconClass: ".icon-eye",
                    onBlur: function (e) {

                        if (e.target.value == '') { return false; }
                        // 注册的时候校验只能4-18位密码
                        var rule = /^[a-zA-Z0-9_-]{4,18}$/;
                        if (!rule.test(e.target.value)) {
                            bui.hint("密码只能由4-18位字母或者数字上下横杠组成");
                            return false;
                        }

                        return true;
                    },
                    callback: function (e) {
                        //切换类型
                        this.toggleType();
                        //
                        $(e.target).toggleClass("active")
                    }
                })

                // 验证码示例
                var $btnSend = router.$("#btnSend");
                var timer = bui.timer({
                    onEnd: function () {
                        $btnSend.removeClass("disabled").text("重新获取验证码");
                    },
                    onProcess: function (e) {
                        var valWithZero = e.count < 10 ? "0" + e.count : e.count;
                        $btnSend.text(valWithZero + "后重新获取");
                    },
                    times: 10
                });

                $btnSend.click(function (argument) {
                    var hasDisabled = $(this).hasClass("disabled");
                    if (!hasDisabled) {
                        $(this).addClass("disabled")
                        bui.hint("验证码发送成功")
                        timer.restart();
                    }
                })

            },
            showCity: function () {
                citySelect && citySelect.show();
            }
        },
        watch: {},
        computed: {},
        templates: {},
        mounted: function () {
            // 数据解析后执行
            var that = this;
            // 登录表单的示例处理, 数据自动绑定到this.login
            this.loginInit();
            // 选择数量
            var uiNumber = bui.number({
                id: '#uiNumber',
                onChange: function () {
                    // 跟bs的数据关联
                    that.form.num = this.value();
                }
            });

            //动态绑定
            var uiSelect = bui.select({
                trigger: "#select",
                title: "请选择区域",
                type: "checkbox",
                data: [{
                    "name": "广东",
                    "value": "11"
                }, {
                    "name": "广西",
                    "value": "22"
                }, {
                    "name": "上海",
                    "value": "33"
                }, {
                    "name": "北京",
                    "value": "44"
                }, {
                    "name": "深圳",
                    "value": "55"
                }, {
                    "name": "南京",
                    "value": "66"
                }],
                onChange: function () {
                    // 跟bs的数据关联
                    that.form.area = this.text();
                }
            });

            // 绑定数据
            loader.import("http://www.easybui.com/demo/js/plugins/citys.js", function () {

                // 普通初始化
                citySelect = bui.levelselect({
                    data: citys,
                    title: "所在地区",
                    // log: true,
                    trigger: ".selected-val",
                    level: 3,
                    field: {
                        name: "n",
                        data: ["c", "a"],
                    },
                    onChange: function () {
                        // console.log(this.value())
                        // 跟bs的数据关联
                        that.form.city = this.value();
                    }
                })

            })


            // 日期初始化
            var uiPickerdate = bui.pickerdate({
                handle: "#pickerdateInput",
                formatValue: "yyyy-MM-dd",
                bindValue: true,
                cols: {
                    hour: "none",
                    minute: "none",
                    second: "none"
                },
                onChange: function (value) {
                    // 跟bs的数据关联
                    that.form.birthday = value;
                }
            });


            // 评论字数
            var comment = bui.input({
                id: "#commentContent",
                showLength: true,
                showIcon: false,
                maxLength: 100,
                onChange: function (value) {
                    // 跟bs的数据关联
                    that.form.comment = this.value();
                }
            })


            // 星级评分
            var uiRating = bui.rating({
                id: "#uiRating",
                value: 3,
                onChange: function () {
                    // 跟bs的数据关联
                    that.form.speed = this.value();
                }
            });


            //
            // 拍照上传
            var $facePhoto = $("#facePhoto");
            var uiUpload = bui.upload();

            $(".bui-upload .bui-btn").on("click", function () {

                uiUpload.add({
                    "from": "camera",
                    "onSuccess": function (val, data) {
                        // $output.text(val);
                        // 展示本地图片
                        this.toBase64({
                            onSuccess: function (url) {
                                $facePhoto.prepend(templatePhoto(url))

                            }
                        });

                        // 也可以直接调用start上传图片
                    }
                })

            })

            function templatePhoto(url) {
                return `<div class="span1">
                  <div class="bui-upload-thumbnail"><img src="${url}" alt="" /></div>
              </div>`
            }


            // 兴趣多选列表
            var selectList2 = bui.select({
                id: "#selectList2",
                type: "checkbox",
                popup: false,
                onChange: function () {
                    that.form.interest = this.text();
                }
            });

            // 性别单选列表-样式2
            var selectList4 = bui.select({
                id: "#selectList4",
                type: "radio",
                popup: false,
                onChange: function () {
                    that.form.sex = this.text();
                }
            });
            // 性别单选列表
            var selectList3 = bui.select({
                id: "#selectList3",
                type: "radio",
                popup: false,
                onChange: function () {
                    that.form.sex2 = this.text();
                }
            });

            // 修复ios 光标跟着一起滚动问题
            if (bui.platform.isIos()) {
                router.$("main").on("scroll", function () {
                    $('input').toggleClass('focus-fixed');
                })
            }
        }
    })
    return bs;
})
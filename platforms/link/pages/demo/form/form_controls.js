loader.define(function (require, exports, module, global) {

    // 合并接收默认参数
    let props = $.extend(true, {}, module.props);
    
    // 配合验证码倒计时, 防止多次初始化
    var timer = bui.timer({
        onEnd: function () {
            bs.sendDisable = "";
            bs.sendText = "重新获取验证码"
        },
        onProcess: function (e) {
            var valWithZero = e.count < 10 ? "0" + e.count : e.count;

            bs.sendText = valWithZero + "后重新获取"
        },
        time: 10
    });

    // 上传控件初始化一次即可
    var uiUpload = bui.upload();
    // 拍照上传
    var $facePhoto = $("#facePhoto");

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
           form: {
                phone:"13800138000",
                password:"13800138000",
                comment:"",
                range:200,
                area:"",
                citys:"",
                citylevel:"",
                birthday:"",
                switchtext:"",
                switch:"1",
                fav:"1",
                fav2:"",
                money:"",
                num:1
           },
           sendDisable:"",
           sendText:"发送验证码",

           interests: ["健身","跑步"],
           interestData: ["羽毛球","健身","足球","跑步"]
        },
        methods: {
            dropdownInit(){

                let that = this;
                var uiDropdown = bui.dropdown({
                    id: "#uiDropdown",
                    data: [{
                        name: "广州",
                        value: "广州"
                    }, {
                        name: "广州2",
                        value: "广州2"
                    }],
                    value:  that.$data.form.city,// 初始值
                    //设置relative为false,二级菜单继承父层宽度
                    relative: false,
                    callback: function (e) { 
                        let val = this.value();

                        // 相互关联
                        that.form.area = val;
                    }
                });
                
                return uiDropdown;
            },
            numberInit(){
                let that = this;
                // 选择数量
                var uiNumber = bui.number({
                    id: '#uiNumber',
                    onChange(){
                        let val = this.value();
                        // 关联
                        that.form.num = val;
                    }
                });

                return uiNumber;
            },
            inputInit(){
                let that = this;
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

                // 评论字数
                var comment = bui.input({
                    id: "#commentContent",
                    showLength: true,
                    showIcon: false,
                    maxLength: 100
                })
                
            },
            sendCode($this){
                // 验证码示例
                if (this.$data.sendDisable == "") {
                    this.sendDisable = "disabled";
                    bui.hint("验证码发送成功")
                    timer.restart();
                }

            },
            ratingInit(){

                // 星级评分
                var uiRating = bui.rating({
                    id: "#uiRating",
                    value: 3
                });
            },
            pickerdateInit(){

                // 日期初始化
                var uiPickerdate = bui.pickerdate({
                    handle: "#pickerdateInput",
                    bindValue: true,
                    formatValue: "yyyy-MM-dd",
                    cols: {
                        hour: "none",
                        minute: "none",
                        second: "none"
                    },
                    onChange: function (value) {
                        
                    }
                });

            },
            selectInit(){
                let that = this;
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
                    onChange(){
                        let val = this.value();
                        let text = this.text();

                        console.log(text,val)

                        that.form.citys = text
                    }
                });
            },
            addPhoto(){
                let that = this;

                // 数据的展示还可以参考store的方式，这里采用dom的方式
                uiUpload.add({
                    "from": "camera",// photo | camera
                    "onSuccess": function (val, data) {
                        // $output.text(val);
                        // 展示本地图片
                        this.toBase64({
                            onSuccess: function (url) {

                                $facePhoto.prepend(that.tplPhoto(url))
                            }
                        });
        
                        // 也可以直接调用start上传图片
                    }
                })
            },
            cityInit(){

                let that = this;
                var citySelect = null;
                // 绑定数据
                loader.import("https://www.easybui.com/demo/js/plugins/citys.js", function () {
                    // citys 是行政规划数据，最新数据请自行百度
                    // 普通初始化
                    citySelect = bui.levelselect({
                        data: citys,
                        title: "所在地区",
                        trigger: ".selected-val",
                        level: 3,
                        field: {
                            name: "n",
                            data: ["c", "a"],
                        },
                        onChange(){
                            let val = this.value();

                            console.log(val)

                            that.form.citylevel = val;
                        }
                    })

                })

            },
            submit(){
                console.log("提交的数据",this.$data.form)
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplInterest(data){
                let html = "";
                data.forEach(el => {
                    html +=`<li class="bui-btn bui-box">
                        <label class="bui-label">${el}</label>
                        <div class="span1"></div>
                        <div class="bui-value">
                            <input type="checkbox" b-model="page.interests" class="bui-choose" name="interest" value="${el}">
                        </div>
                    </li>`
                });

                return html;
            },
            tplPhoto(url) {
                return `<div class="span1">
                        <div class="bui-upload-thumbnail"><img src="${url}" alt="" /></div>
                    </div>`
            }
        },
        mounted: function(){
            // 数据解析后执行

            this.inputInit();

            this.dropdownInit();

            this.numberInit();

            this.ratingInit();

            this.pickerdateInit();

            this.selectInit();

            this.cityInit();

        }
    })



    // 修复ios 光标跟着一起滚动问题, 微信IOS版,在失去焦点以后,需要调用一次 this.scrollIntoView ,可以解决底部灰色问题
    // if (bui.platform.isIos()) {
    //     router.$("main").on("scroll", function () {
    //         $('input').toggleClass('focus-fixed');
    //     })

    //     // 
    //     router.$('input[type="text"],textarea').on("blur", function () {
    //         this.scrollIntoView(false)
    //     })
    // }
})
loader.define(function (require, exports, module, global) {

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "form",
        data: {
           userinfo: null,
           interests: ["健身","跑步"],
           interestData: ["羽毛球","健身","足球","跑步"]
        },
        methods: {
            getUserinfo(){
                // 模拟请求本地数据
                bui.ajax({
                    url:`${module.path}userinfo.json`,
                    data: {}
                }).then((result)=>{
                    // 赋值改变渲染模板
                    this.userinfo = result.data;
                })
            },
            reset(){
                
                // 赋值改变渲染模板
                this.userinfo = {
                    "name":"",
                    "uid":"",
                    "phone":"",
                    "email":"",
                    "company":"",
                    "qq":"",
                    "interest":[],
                    "sex":"女"
                };

                this.interest = [];
            },
            submit(){

                // 读取需要挂载在 this.$data.xxx
                this.userinfo.interest = this.$data.interests;

                console.log(this.$data.userinfo);
                // 模拟请求本地数据
                bui.ajax({
                    url:`${module.path}userinfo.json`,
                    data: this.$data.userinfo
                }).then((result)=>{
                    // 赋值改变渲染模板
                    this.userinfo = result.data;
                })
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
                            <input type="checkbox" b-model="form.interests" class="bui-choose" name="interest" value="${el}">
                        </div>
                    </li>`
                });

                return html;
            }
        },
        mounted: function(){
            // 数据解析后执行
            // 模拟请求本地数据，获取用户信息并赋值
            this.getUserinfo();
        }
    })
})
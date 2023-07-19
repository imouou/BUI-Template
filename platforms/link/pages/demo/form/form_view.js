loader.define(function (require, exports, module, global) {

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "formview",
        data: {
           userinfo: null,
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
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplUserinfo(data){
                return `
                        <h3 class="section-title">个人信息--左对齐</h3>
                        <div class="bui-list">
                            <div class="bui-btn bui-box">
                                <div class="bui-label">姓名：</div>
                                <div class="span1">
                                    <div class="bui-value">${data.name}</div>
                                </div>
                            </div>
                            <div class="bui-btn bui-box">
                                <div class="bui-label">证件号码：</div>
                                <div class="span1">
                                    <div class="bui-value">${data.uid}</div>
                                </div>
                            </div>
                            <div class="bui-btn bui-box">
                                <div class="bui-label">手机号码：</div>
                                <div class="span1">
                                    <div class="bui-value">${data.phone}</div>
                                </div>
                            </div>
                            <div class="bui-btn bui-box">
                                <div class="bui-label">邮箱：</div>
                                <div class="span1">
                                    <div class="bui-value">${data.email}</div>
                                </div>
                            </div>
                            <div class="bui-btn bui-box">
                                <div class="bui-label">公司：</div>
                                <div class="span1">
                                    <div class="bui-value">${data.company}</div>
                                </div>
                            </div>
                        </div>
                        <h3 class="section-title">更多资料--右对齐</h3>
                        <div class="bui-list">
                            <div class="bui-btn bui-box">
                                <div class="bui-label">兴趣：</div>
                                <div class="span1">
                                </div>
                                <div class="bui-value">${data.interest}</div>
                            </div>
                            <div class="bui-btn bui-box">
                                <div class="bui-label">QQ：</div>
                                <div class="span1">
                                </div>
                                <div class="bui-value">${data.qq}</div>
                            </div>
                        </div>
                `
            }
        },
        mounted: function(){
            // 数据解析后执行
            // 模拟请求本地数据，获取用户信息并赋值
            this.getUserinfo();
        }
    })
})
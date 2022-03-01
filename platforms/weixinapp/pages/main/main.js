loader.define(function(requires,exports,module,global){
    //  进入页面的时候，修改微信标题
    document.title = "首页";
    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "webview",
        data: {
            title:"首页"// 后退的时候给全局修改标题
        },
        methods: {
            getEnv:function(){
                global.webview.getEnv(function(res) { 
                    bui.alert(res) 
                });
            },
            checkEnv:function(){
                // 检测是否在小程序里面
                bui.alert(global.webview.isMiniProgram());;
            },
            navigateTo:function(url){
                global.webview.navigateTo(url)
            },
            navigateBack:function(opt){
                global.webview.navigateBack();
            },
            reLaunch:function(opt){
                global.webview.reLaunch(opt)
            },
            switchTab:function(opt){
                global.webview.switchTab(opt)
            },
            redirectTo:function(opt){
                global.webview.redirectTo(opt)
            },
            postMessage:function(opt){
                // 在小程序里面,点击发送消息给小程序,再点触发分享,才能在 onLoad 里面接收到webview传的消息
                global.webview.postMessage(opt)
            }
        },
        watch: {},
        computed: {},
        templates: {},
        beforeMount: function(){
            // 数据解析前执行, 修改data的数据示例
            // this.$data.a = 2
        },
        mounted: function(){
            // 数据解析后执行
        }
    })
})
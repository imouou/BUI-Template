bui.ready(function(){

    var pageview = {
        init(){
            console.log("init")
            this.bind();
        },
        bind(){
            // 绑定按钮跳转
            bui.btn({id:".bui-page",handle:".bui-btn"}).load();
        }
    }

    pageview.init();
});

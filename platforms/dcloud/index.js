
// 开启单页路由
window.router = bui.router();

bui.on("pageinit",function(){
    // 初始化路由
    router.init({
        id: "#bui-router"
    })

})

// H5 plus事件处理
function plusReady(){
	// 隐藏滚动条
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});

    // 监听后退按钮
   var flag = 0;
   plus.key.addEventListener('backbutton', function(){
    if( router.getHistory().length > 1 ){
        bui.back();
    }else{
        if (flag == 0) {
         bui.hint("再按一次就退出应用了!");
         flag = flag + 1;
         //2s后重新设置回去
         setTimeout(function() {
          flag = 0;
         }, 2000);
        } else if (flag == 1) {
          plus.runtime.quit();
         
        }
    }
    
   }, false);

}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}

    
bui.on("pageinit",function () {
  fixStatusBar();
})


// 修复Binotouch打包沉浸式状态栏
function fixStatusBar() {
  var platform = bui.platform;
  if( platform.isIos() && platform.isIphoneX() ){
    $("body").addClass("iphoneX");
  }else if( platform.isIos() && !platform.isIphoneX() ){
    $("body").addClass("iphone");
  }
}
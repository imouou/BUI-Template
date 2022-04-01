/**
 * 空组件, xxx 为创建时候起的模块名
 * 默认模块名为路径: pages/xxx/index
 * @return {[object]}  [ 返回一个对象, 可以通过loader加载模块的方法.]
   @example

   第1种：默认加载展示
   html:
   <component name="pages/xxx/index"></component>

   第2种：延迟加载，等到执行 loader.delay 展示
   html:
   <component id="compxxx" name="pages/xxx/index" delay="true"></component>

   js: 
   // 动态传参
   loader.delay({
       id:"#xxx",
       param:{}
   })

   第3种：只保留标签
   html:
   <component id="xxx"></component>

   js: 
   // 动态传参
   loader.load({
       id:"#xxx",
       url: "pages/xxx/index.html",
       param:{}
   })


 */
loader.define(function(requires, exports, module, global) {
    
    // 定义
    var pageview = {
        init: function() {
            // 这里初始化
        }
    };

    // 第1次初始化
    pageview.init();

    // 抛出模块
    return pageview;
})
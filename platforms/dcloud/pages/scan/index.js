
/**
 * 组件名: pages/components/scan/index
 * @name pages/components/scan/index
 * @since 1.7.1
 * @author imouou
 * @date 2022-5-25
 * @param {function} [callback] [ 点击的时候触发，调用原生API扫码接口 ]
 * @example 
 *
   html: 
   <component id="scan" name="pages/components/scan/index" delay="true"></component>
   
   js:
   loader.delay({
        id:"#scan",
        param:{
            callback: function(e){
                // 点击的时候触发
            }
        }
    })


*
*/
loader.define(function (require, exports, module) {
    // 合并接收的参数
    let props = $.extend(true, {
        callback: null,
    }, module.props);

    var mid = module.id;

    var pageview = {
        init() {
            var that = this;
            bui.$(`#${mid} .round-wrap`).click(function (e) {
                props.callback && props.callback.call(that, e);
            })
        }
    }
    pageview.init();

    return pageview;
})

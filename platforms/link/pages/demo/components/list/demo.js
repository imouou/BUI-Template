loader.define(function(require,exports,module,global){

    var pageview = {
        init(){
            
            // 当前为静态接口，且分页大小刚好等于返回的数据大小，可以无限循环
            loader.delay({
                id:"#list",
                param: {
                    url: `${module.path}index.json`,
                    // 以下常用参数根据自己需要配置
                    // data: {},   // 请求参数，页数跟大小不用传
                    // header: {}, // 头部请求参数，需要再传
                    // 字段映射，需要再传
                    // field: {
                    //     page: "page",   // 页数
                    //     size: "pageSize",// 分页大小
                    //     data: "data"    // 返回回来的数据字段
                    // },
                    // 自定义模板，非必需
                    // template: function (data) {
                    //     // 自定义模板
                    //     var html = "";
                    //     data.forEach(function(el, index) {
                
                    //         html +=`<li class="bui-btn bui-box" href="pages/detail.html?id=${el.id}">
                    //             <div class="bui-thumbnail" style="width:${props.imageWidth};height:${props.imageHeight};"><img src="${el.image}" alt=""></div>
                    //             <div class="span1">
                    //                 <h3 class="item-title">${el.title}</h3>
                    //                 <p class="item-text">${el.desc}</p>
                    //             </div>
                    //             <i class="icon-listright"></i>
                    //         </li>`
                    //     });
                
                    //     return html;
                    // }
                }
            });
        }
    }   
    // 初始化
    pageview.init();
    return pageview; 
})
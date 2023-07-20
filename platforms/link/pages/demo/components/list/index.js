
/**
 * 组件名: pages/components/list/index
 * 更多参数请参考 bui.list 控件API
 * @name pages/components/list/index
 * @since 1.7.0
 * @author imouou
 * @date 2022-04-2
 * @param {string} url [ 请求的url ]
 * @param {object} data [ 请求的参数 ]
 * @param {object} headers [ 请求的头部参数 ]
 * @param {object} method [ 请求的方式 GET | POST ]
 * @param {object} field [ 参数字段映射 {
            page: "page",
            size: "pageSize",
            data: "data"
        } page: 分页字段, size: 分页大小字段, data: 数据返回的数组字段]
 * @param {function} template [ 自定义模板 ]
 * @param {function} callback [ 数据点击当前行执行 默认：null ]
 * @param {function} onRefresh [ 数据刷新以后执行 默认：null ]
 * @param {function} onLoad [ 数据渲染以后执行 默认：null ]
 * @example 
 *
   html: 
   <component id="list" name="pages/components/list/index" delay="true"></component>

   js:
   loader.delay({
        id:"#list",
        param:{
            url:"",
            data: {},
            template:function (data) {
                // 自定义模板
                var html = "";
                data.forEach(function(el, index) {
        
                    html +=`<li class="bui-btn bui-box" href="pages/detail.html?id=${el.id}">
                        <div class="bui-thumbnail" style="width:${props.imageWidth};height:${props.imageHeight};"><img src="${el.image}" alt=""></div>
                        <div class="span1">
                            <h3 class="item-title">${el.title}</h3>
                            <p class="item-text">${el.desc}</p>
                        </div>
                        <i class="icon-listright"></i>
                    </li>`
                });
        
                return html;
            }
        }
   })
*
*/


loader.define(function (requires, exports, module, global) {

    // 合并接收的参数
    let props = $.extend(true, {
        url: `${module.path}index.json`,
        targeturl: "",
        imageWidth: "2.4rem",
        imageHeight: "2rem",
        data: {},
        headers: {},
        refresh: true,
        pageSize: 4,
        method: "GET",
        field: {
            page: "page",
            size: "pageSize",
            data: "data"
        },
        template: function (data) {

            var html = "";
            data.forEach(function (el, index) {
                // 跳转地址
                let url = props.targeturl ? `href="${props.targeturl}?id=${el.id}"` : "";

                html += `<li class="bui-btn bui-box" ${url}>
                    <div class="bui-thumbnail" style="width:${props.imageWidth};height:${props.imageHeight};"><img src="${el.image}" alt=""></div>
                    <div class="span1">
                        <h3 class="item-title">${el.title}</h3>
                        <p class="item-text">${el.desc}</p>
                    </div>
                    <i class="icon-listright"></i>
                </li>`
            });

            return html;
        },
        onRefresh: null,
        onLoad: null,
        callback: null
    }, module.props);

    let mid = module.id;
    // 列表控件 js 初始化: 
    var uiList = bui.list({
        ...props,
        // 覆盖 props id 
        id: `#${mid} .bui-scroll`
    });

    return uiList;
})
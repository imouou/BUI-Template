loader.define(function(requires, exports, module) {
    var pageview = {
        init: function() {
            this.listInit();
        },
        listInit: function() {
            // 列表控件 js 初始化: 
            var uiList = bui.list({
                id: `#${module.id} .bui-scroll`,
                url: `${module.path}index.json`, // 本地测试数据
                pageSize: 5,
                data: {},
                //如果分页的字段名不一样,通过field重新定义
                field: {
                    page: "page",
                    size: "pageSize",
                    data: "data"
                },
                callback: function(e) {},
                template: function(data) {
                    var html = "";
                    data.forEach(function(el, index) {

                        html += `<li class="bui-btn bui-box">
                            <div class="bui-thumbnail"><img src="${el.image}" alt=""></div>
                            <div class="span1">
                                <h3 class="item-title">${el.name}</h3>
                                <p class="item-text">${el.address}</p>
                                <p class="item-text">${el.distance}公里</p>
                            </div>
                            <span class="price"><i>￥</i>${el.price}</span>
                        </li>`
                    });

                    return html;
                }
            });
        }
    }

    pageview.init();
})
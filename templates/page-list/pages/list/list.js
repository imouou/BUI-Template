/**
 * 列表滚动加载
 * 默认模块名: pages/list/list
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (requires, exports, module, global) {

    var pageview = {
        init: function () {
            this.list();
        },
        list: function () {
            var uiList = bui.list({
                id: "#scrollList",
                // url: "http://www.easybui.com/demo/json/shop.json",
                url: `${module.path}shop.json`,
                pageSize: 5,
                data: {},
                //如果分页的字段名不一样,通过field重新定义
                field: {
                    page: "page",
                    size: "pageSize",
                    data: "data"
                },
                callback: function (e) {
                    // e.target 为你当前点击的元素
                    // $(e.target).closest(".bui-btn") 可以找到你当前点击的一整行,可以把一些属性放这里
                    console.log($(e.target).closest(".bui-btn").attr("class"))
                },
                template: function (data) {
                    var html = "";
                    data.map(function (el, index) {

                        // 处理角标状态
                        var sub = '',
                            subClass = '';
                        switch (el.status) {
                            case 1:
                                sub = '新品';
                                subClass = 'bui-sub';
                                break;
                            case 2:
                                sub = '热门';
                                subClass = 'bui-sub danger';
                                break;
                            default:
                                sub = '';
                                subClass = '';
                                break;
                        }

                        html += `<li class="bui-btn bui-box" href="pages/ui/article.html?title=${el.name}">
                            <div class="bui-thumbnail ${subClass}" data-sub="${sub}" ><img src="images/img.svg" alt=""></div>
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
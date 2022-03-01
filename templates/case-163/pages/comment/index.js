loader.define(function(requires, exports, module) {
    // 获取新闻的参数
    var pageParams = router.getPageParams();

    var pageview = {
        init: function() {

            // 评论列表
            this.list();
        },
        list: function() {

            var uiList = bui.list({
                id: "#commentList",
                url: `${module.path}index.json`,
                data: {},
                template: function(data) {
                    var html = "";
                    console.log(data)
                    data.forEach(function(el, index) {
                        html += `<li class="bui-btn bui-box-align-top">
                          <div class="thumbnail"><img src="${el.image}" alt=""></div>
                          <div class="span1">
                              <h3 class="item-title"><span class="name">${el.name}</span><span class="digg bui-right">${el.digg} <i class="icons"><img src="images/digg.png" alt=""></i></span></h3>
                              <div class="item-text"><span class="area">${el.city}</span> <span class="time">${el.date}</span></div>
                              <div class="item-content">
                                  ${el.content}
                              </div>
                          </div>
                      </li>`;
                    });

                    return html;
                },
                refresh: false,
                onLoad: function(scroll) {
                    // 自定义渲染
                },
                callback: function(e) {
                    // 点击单行回调 console.log($(this).text())
                },
                page: 1,
                pageSize: 10,
                field: {
                    page: "page", // 分页字段
                    size: "pageSize", // 页数字段
                    data: "data" // 数据字段
                }
            });
        }
    };

    // 页面初始化
    pageview.init();
})
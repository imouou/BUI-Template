/**
 * [下拉刷新,滚动分页公共component]
 */
loader.define(function(require, exports, module) {
    var pageview = {
      init: function(){
        // 初始化列表
        this.list()
      },
      list: function() {
          var uiList = bui.list({
              id: `#${module.id} .bui-scroll`,
              url: `${module.path}index.json`,//当前文件夹下的测试数据
              data: {},
              page: 1,
              pageSize: 10,
              field: {
                  page: "page", // 分页字段
                  size: "pageSize", // 页数字段
                  data: "" // 数据
              },
              onRefresh: function(scroll, data) {
                  var firstObj = data[0];
                  // 刷新的时候,通过第一条id去获取最新10条数据
                  uiList.option(data, { "lastid": firstObj.Id })
              },
              onLoad: function(scroll, data) {
                  // 加载一页以后做什么事情
              },
              template:function (data) {
                  var html = '';

                  $.each(data, function(index, el) {
                      html += `<li class="bui-btn bui-box-align-top" href="pages/detail/detail.html?id=${el.Id}">
                          <div class="thumbnail"><img src="${el.ImgPath}" alt=""></div>
                          <div class="span1">
                              <h3 class="item-title">${el.Name}</h3>
                              <div class="item-text bui-box">
                                  <div class="span1">
                                     <span class="cate">${el.ExInforSources}</span>
                                  </div>
                                  <span class="stick">${el.CommentsNum}跟帖</span>
                              </div>
                          </div>
                      </li>`;
                  });

                  return html;
              }
          });

      }
    };

    pageview.init();
})

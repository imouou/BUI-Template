/**
 * 搜索列表页模板
 * 默认模块名: pages/search-list/search-list
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var uiList;
    var pageview = {};
    
    // 模块初始化定义    
    pageview.init = function () {

        // 列表初始化
        uiList = bui.list({
            id: "#uiListSearch",
            // 替换成接口地址
            url: "userlist.json",
            // 如果接口的返回数据格式不是 {data:[]} ; 则需要做字段映射 
            field: {
                data:"data"
            },
            page:1,
            pageSize:9,
            onRefresh: function () {},
            onLoad: function () {},
            template: template,
            callback: function(argument) {
                console.log($(this).text())
            }
        });
        
        // 搜索控件
        var uiSearchbar = bui.searchbar({
            id:"#uiSearchbar",
            callback: function (ui,keyword) {
              // 点击搜索
              bui.hint("你点击了search");

                  //点击搜索
                $(".search-list").empty();

                // 重新初始化数据
                uiList.init({
                    page: 1,
                    data: {
                        "keyword":keyword
                    }
                });
                
            },
            onInput: function(ui,keyword) {
              // 输入实时搜索
            },
            onRemove: function(ui,keyword) {
              // 删除关键词需要做什么其它处理
            }
        });

    }
    
    // 列表生成模板
    function template (data) {
        var html = "";

        $.each(data,function(index, el) {

            html +='<li class="bui-btn bui-box">';
            html +='    <div class="icon"><img src="images/applogo.png" alt=""></div>';
            html +='    <div class="span1">'+el.name+'</div>';
            html +='    <i class="icon-listright"></i>';
            html +='</li>';
        });

        return html;
    }


    // 初始化
    pageview.init();

    // 输出模块
    module.exports = pageview;
})

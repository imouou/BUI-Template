loader.define(function(require,exports,module) {
    //搜索条的初始化
        bui.searchbar({
            id:"#searchbar",
            onInput: function(module,keyword) {
                //实时搜索
                // console.log(keyword);
            },
            onRemove: function(module,keyword) {
                //删除关键词需要做什么其它处理
            },
            callback: function (module,keyword) {
                //点击搜索
                $("#scroll .bui-list").empty();

                // console.log(keyword)
                var uiList = bui.list({
                    id: "#scroll",
                    url: "http://eid.bingosoft.net:82/bui/demo/json/userlist.json",
                    data: {
                        keyowrd: keyword
                    },
                    page:1,
                    pageSize:10,
                    template: template,
                    callback: function(argument) {
                        console.log($(this).text())
                    }
                });
            }
        });
    
    // 列表生成模板
    function template (data) {
        var html = "";

        $(data).each(function(index, el) {

            html += '<li class="bui-btn"><i class="icon-facefill"></i>'+el.name+'</li>';
        });

        return html;
    }
    return {};
})
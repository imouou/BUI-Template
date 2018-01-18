// 默认已经定义了main模块
loader.define(function(require,exports,module) {

    // 页面的列表下拉控件
    var uiList = bui.list({
            id: "#listNews",
            url: "http://www.easybui.com/demo/json/chuangyi/article-list.json",
            page:1,
            pageSize:9,
            template: template,
            data: {},
            //如果分页的字段名不一样,通过field重新定义
            field: {
                page: "page",
                size: "pageSize",
                data: ""
            },
            onRefresh: function (scroll) {
                //刷新的时候执行
            },
            onLoad: function (scroll) {
                // 页面上拉执行
            },
            callback: function (e) {
                // 点击每一行的回调
            }
        });

    //生成模板
    function template (data) {
        var html = "";
        $.each(data,function(index, el) {
            html +='<li class="bui-btn bui-box"><div class="thumbnail"><img src="'+el.ImgPath+'" alt=""></div><div class="span1"><h3 class="item-title">'+el.Name+'</h3><p class="item-text">'+el.ExInforSources+'</p></div><i class="icon-listright"></i></li>';
            
        });

        return html;
    }
})
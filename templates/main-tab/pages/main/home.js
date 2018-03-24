loader.define(function(require,exports,module) {
    
    var pageview = {},  // 页面模块
        uiList,         // 列表控件
        uiSlide;        // 焦点图控件;

    // 页面初始化
    pageview.init = function () {
        
        // 初始化焦点图
        uiSlide = bui.slide({
            id:"#tabSlideImg",
            height:200,
            autoplay : true,
            autopage: true,
            zoom: true
        })

        // 初始化列表刷新加载
        uiList = bui.list({
            id: "#uiTabScroll",
            url: "http://www.easybui.com/demo/json/chuangyi/article-list.json",
            data: {},
            pageSize:10,
            field: {
                page: "page",        // 分页字段
                size: "pageSize",    // 页数字段
                data: ""         // 数据
            },
            template: template,
            onLoad: function (scroll) {
                // 自定义渲染
            },
            callback: function (e) {
                // 点击单行回调 console.log($(this).text())
            }
        });

    }

    //生成列表的模板
    function template (data) {
    
        var html = "";
            $.each(data,function(index, el) {
                html +='<li class="bui-btn bui-box-align-top">';
                html +='    <div class="thumbnail"><img src="images/Personal3-img-contact.png" alt=""></div>';
                html +='    <div class="span1">';
                html +='        <h3 class="item-title">'+el.Name+'</h3>';
                html +='        <div class="item-text bui-box">';
                html +='            <div class="span1">'+el.ExInforSources+'</div>';
                html +='            <span class="time"><i class="icon-">&#xe643;</i>23</span>';
                html +='            <span class="time"><i class="icon-">&#xe680;</i>495</span>';
                html +='            <span class="time"><i class="icon-">&#xe641;</i>28</span>';
                html +='        </div>';
                html +='    </div>            ';
                html +='</li>';
            });
    
        return html;
    };


    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
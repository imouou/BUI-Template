loader.define(function(require,exports,module) {
    //区域查询初始化
    var uiSelect = bui.select({
            trigger:"#select",
            title:"请选择区域",
            type:"checkbox",
            data: [{
                "name":"广东",
                "value":"11"
            },{"name":"广西",
                "value":"22"
            },{
                "name":"上海",
                "value":"33"
            },{"name":"北京",
                "value":"44"
            },{
                "name":"深圳",
                "value":"55"
            },{"name":"南京",
                "value":"66"
            }],
            callback: function (argument) {

                var index = $(this).parent().index();

                if( index == 0 ){
                    uiSelect.selectNone();
                }else{
                    uiSelect.hide();
                }
            }

        });

    //日期
    var input = $("#datepicker_input");
    var uiPickerdate = bui.pickerdate({
        handle:"#datepicker_input",
        value: '2015/8/10 9:00',
        min: '2014/4/5 9:00',
        max: '2016/4/5 10:00',
        onChange: function(value) {
            input.val(value);
        }
    });
    
    
    return {};
})
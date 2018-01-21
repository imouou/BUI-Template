loader.define(function(require,exports,module) {
    
    //静态自定义对话框
    var dialog = bui.dialog({
            id: "#dialog3",
            mask: false
        });
    $('#btnOpen').on("click",function (argument) {
        dialog.open();
    })

    //alert
    $('#btnAlert').on("click",function (argument) {
        bui.alert("这是alert对话框");
    });
    //confirm
    $('#btnConfirm').on("click",function (argument) {
        bui.confirm("这是confirm对话框",function (argument) {
            console.log($(this).text());
        });
    })
    
    return {};
})
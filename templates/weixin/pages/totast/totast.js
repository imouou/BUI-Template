loader.define(function(require,exports,module) {
    
    bui.hint({content:"<i class='icon-check'></i><br />已完成", position:"center" , effect:"fadeInDown"});

    $('#btnTop').on("click",function  (argument) {
        bui.hint({ appendTo:"#main", content:"欢迎使用BUI", position:"top" , close:true, autoClose: false});
    })
    

    $('#btnBottom').on("click",function  (argument) {
        bui.hint("欢迎使用BUI");
    })
    
    return {};
})
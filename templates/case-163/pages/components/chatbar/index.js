loader.define(function(requires,exports,module){

    var pageParams = bui.history.getParams(module.id);
    // 如果type是在评论页进来, 则不需要显示多少条评论
    console.log(pageParams.type)

    // 初始化数据行为存储
    var bs = bui.store({
        scope: "comment",
        data: {
           text: "",
           canSend: false,
           count:1233,
        },
        methods: {
          gotoComment: function(){
            bui.load({url:"pages/comment/index.html",param:{ id: pageParams.id } });
          },
          showSend: function(){
            // 如果type是在评论页进来, 则不需要显示多少条评论
            if( pageParams.type === "comment" ){
              return this;
            }
            this.canSend = true;
          },
          hideSend: function(){
            // 如果type是在评论页进来, 则不需要显示多少条评论
            if( pageParams.type === "comment" ){
              return this;
            }
            this.canSend = false;
          },
          send: function(){
            var that = this;
            // 发送评论信息
            bui.ajax({
                url: `${module.path}index.json`,
                data: {
                  comment: this.$data.text,
                  id: pageParams.id
                },//接口请求的参数
                // method: "POST"
            }).then(function(result){
                // 成功
                bui.hint({
                  content:result.data.msg,
                  effect: "fadeInDown",
                  position: "center",
                });
                // 清空内容
                that.text = "";
                // 隐藏发送按钮
                that.hideSend();
            },function(result,status){
                bui.hint("评论失败");

                // 隐藏发送按钮
                that.hideSend();
                // 失败 console.log(status)
            });
          }
        },
        beforeMount: function(){
            // 数据解析后执行
            if( pageParams.type === "comment"){
              this.$data.canSend = true;
            }
        },
        mounted: function(){
            // 数据解析后执行
        }
    })

    return bs;
})

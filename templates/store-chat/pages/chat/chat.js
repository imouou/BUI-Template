/**
 * 聊天对话模板
 * 默认模块名: pages/chat/chat
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var bs = bui.store({
      scope: "page",
      data: {
        message: "",
        messages: [{
          content: "Hello",
          type: 1,
        },{
          content: "Hello",
          type: 0,
        }]
      },
      methods: {
        sendMessage: function () {
          // 发送信息
          var item = {
            content: this.message,
            type: 0,
          }
          this.messages.push(item);

          // 清空信息
          this.message = "";
        },
        fixKeyboard: function () {
          // 修复键盘在激活的时候,导致滚动条问题
          var $chatInput = $("#chatInput");

          var interval = null;
          var count = 3;
          // 安卓键盘弹出的时间较长;
          var time = bui.platform.isIos() ? 200 : 400;
          // 为input绑定事件
          $chatInput.on('focus', function () {

              var agent = navigator.userAgent.toLowerCase();
              interval = setTimeout(function() {
                  if (agent.indexOf('safari') != -1 && agent.indexOf('mqqbrowser') == -1 &&
                      agent.indexOf('coast') == -1 && agent.indexOf('android') == -1 &&
                      agent.indexOf('linux') == -1 && agent.indexOf('firefox') == -1) {
                      //safari浏览器
                      window.scrollTo(0, 1000000);
                      setTimeout(function() {
                          window.scrollTo(0, window.scrollY - 45);
                      }, 50)

                  } else {
                      //其他浏览器
                      window.scrollTo(0, 1000000);
                  }

              }, time);
          }).on('blur', function () {
              if( interval ){
                  clearTimeout(interval);
              }

              var agent = navigator.userAgent.toLowerCase();
              interval = setTimeout(function() {
                  if (!(agent.indexOf('safari') != -1 && agent.indexOf('mqqbrowser') == -1 &&
                          agent.indexOf('coast') == -1 && agent.indexOf('android') == -1 &&
                          agent.indexOf('linux') == -1 && agent.indexOf('firefox') == -1)) {
                          //safari浏览器
                      window.scrollTo(0, 30);
                  }
              }, 0);
          });
        }
      },
      computed: {
        disabled: function () {
          // 发送按钮的状态
          if( this.message ){
            return false;
          }else{
            return true;
          }
        }
      },
      templates: {
        tplMessage: function (data) {
            var html = "";
            html +=`<div class="bui-box-center">
                <div class="time">5月11日 08:30</div>
            </div>`;
            data.forEach(function (item,index) {
              var type = item.type || 0,  // 0 为自己, 1 为对方
                  content = item.content;

              switch(type){
                  case 0:
                  html+=`<div class="bui-box-align-top chat-mine">
                              <div class="span1">
                                  <div class="bui-box-align-right">
                                      <div class="chat-content bui-arrow-right">
                                       ${content}
                                      </div>
                                  </div>
                              </div>
                              <div class="chat-icon"><img src="images/applogo.png" alt=""></div>
                          </div>`
                  break;
                  case 1:
                  html+=`<div class="bui-box-align-top chat-target">
                              <div class="chat-icon"><img src="images/applogo.png" alt=""></div>
                              <div class="span1">
                                  <div class="chat-content bui-arrow-left">${content}</div>
                              </div>
                          </div>`
                  break;
              }
            })

              return html;
        }
      },
      mounted: function () {
        // 示例增加数据
        this.messages.push({
          content: "What Can I do for You?",
          type: 0
        })
        // 绑定键盘的激活状态
        this.fixKeyboard();
      }
    })

    // 输出模块
    return bs;
})

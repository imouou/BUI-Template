loader.define(function (require, exports, module, global) {

  // 缓存当前目录路径
  var modpath = module.path;
  
  // 初始化数据行为存储
  var bs = bui.store({
      el: `#${module.id}`,
      scope: "scanpage",
      data: {
		  placeholderImg: `${module.path}/images/barcode.png`,
		  historyList:[]
      },
      methods: {
		openpage: function(title,url){
			try{
				// 打开新webview
				var barcodeWV = plus.webview.create(url, 'barcode', {
				  titleNView: {
					titleText: title,
					titleColor: '#fff',
					backgroundColor: '#39a4ff',
					autoBackButton: false	// 不需要后退按钮了
				  }
				});
				// 打开原生新窗口，并加载了扫码组件
				barcodeWV.show('slide-in-right', 300);
			}catch(e){
				bui.hint("调试环境需要在真机环境或者模拟环境");
			}
			
		},
  		scaned:function(type, result, file){
			// 扫码成功存储数据并更新dom
			var gid =  bui.guid();
			var item = {id:gid, type:type, result:result, file:file };
			 // 新增一条数据
			this.historyList.push(item);
			// 更新图片
			this.update(item);
  		},
		update: function (item){
			// 更新本地图片
			var that = this;
			if(!item.file || item.file=='null'){
				this.placeholderImg = `${module.path}/images/barcode.png`;	
			} else{
				// 根据图片的地址转换成可以页面展示的路径
				plus.io.resolveLocalFileSystemURL(item.file, function(entry){
					that.placeholderImg = entry.toLocalURL();
				});
			}
		},
		selected:function(id){
			
			// 选中展示图片数据，通过id去匹配
			var item = bui.array.get(this.historyList,id);
			
			// 更新图片
			this.update( item );
			
			// 是网址就打开跳转
			if(item.result.indexOf('http://')==0  || item.result.indexOf('https://')==0){
				plus.nativeUI.confirm(item.result, function(i){
					if(i.index == 0){
						plus.runtime.openURL(item.result);
					}
				}, '', ['打开', '取消']);
			} else{
				plus.nativeUI.alert(item.result);
			}
		},
		cleanHistroy(){
			// 清空数据
			this.historyList = [];
			
			plus.io.resolveLocalFileSystemURL('_doc/barcode/', function(entry){
				entry.removeRecursively(function(){
					// Success
				}, function(e){
					//alert( "failed"+e.message );
				});
			});
		}
      },
	  templates: {
		  tplHistory(data){
			  var html = "";
			  if( data.length ){
				  data.forEach((item,index)=>{
				  	html += `<li class="bui-btn bui-box" b-click="scanpage.selected('${item.id}')">类型：${item.type}<div class="span1"></div>${item.result}</li>`
				  })
				  
			  }else{
				  html += `<li class="bui-btn">暂无历史记录</li>`
			  }
			  
			  return html;
		  }
	  },
      mounted: function () {
          // 数据解析后执行
		  var that = this;
		  
		  // 动态编译组件，需要传当前事件给它。
          loader.delay({
            id: "#scan",
            param: {
              callback: function (e) {
                // 点击了扫码
          
                try {
				  // 根据当前目录查找扫码
                  var url = `index.html#${modpath}scan-dcloud/index`;
				  // 打开新页面，以webview的形式
				  that.openpage('二维码扫描',url);
          
                } catch (e) {
                  bui.hint("调用扫码失败")
                }
              }
            }
          })
      }
  })
  
  return bs;

})
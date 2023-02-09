loader.define(function (require, exports, module, global) {

    var scan = null;//扫码组件
	var wo = null;
	var ws = null;
	
    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "scan",
        data: {
        },
        methods: {
			plusReady() {
				
				// 获取窗口对象
				ws = plus.webview.currentWebview();
				wo = ws.opener();
				// 开始扫描
				ws.addEventListener('show', function() {
					scan = new plus.barcode.Barcode('bcid');
					scan.onmarked = bs.onmarked;
					scan.start({
						conserve: true,
						filename: '_doc/barcode/'
					});
				}, false);
				// 显示页面并关闭等待框
				ws.show('pop-in');
			},
			clearHistory(){
				// 清空本地二维码信息
				plus.io.resolveLocalFileSystemURL('_doc/barcode/', function(entry){
					entry.removeRecursively(function(){
						// Success
					}, function(e){
						//alert( "failed"+e.message );
					});
				});
			},
            back(hide) {
				// 原生的关闭后退，关闭窗口才能把扫码一起关掉
                if(window.plus){
                	var ws=plus.webview.currentWebview();
                	if(hide||ws.preate){
                		ws.hide('auto');
                	}else{
                		ws.close('auto');
                	}
                }
            },
            onmarked(type, result, file) {
                // 二维码扫描成功
                switch (type) {
                    case plus.barcode.QR:
                        type = 'QR';
                        break;
                    case plus.barcode.EAN13:
                        type = 'EAN13';
                        break;
                    case plus.barcode.EAN8:
                        type = 'EAN8';
                        break;
                    default:
                        type = '其它' + type;
                        break;
                }
                result = result.replace(/\r\n/g, '');
				
				// 弹窗只能用原生才可以展示
                // plus.nativeUI.alert('扫描结果:' + JSON.stringify(result), function() {
                // 	console.log('扫描成功')
                // }, "二维码扫描", "OK");
				
				// 调用上一个页面的历史记录抛出的方法并执行
				wo.evalJS("bui.history.getLast('exports').scaned('"+ type +"','"+ result +"','"+ file +"');");
                // 后退
				bs.back();
            },
            scanPicture() {
                // 相册选择扫码
                let that = this;
                plus.gallery.pick(function (path) {
                    plus.barcode.scan(path, that.onmarked, function (error) {
                        plus.nativeUI.alert('无法识别此图片');
                    });
                }, function (err) {
                    console.log('Failed: ' + err.message);
                });
            }
        },
        mounted: function () {
            // 数据解析后执行
            
        }
    })
	
	// 初始化
	if(window.plus) {
    	bs.plusReady();
    } else {
    	document.addEventListener('plusready', bs.plusReady, false);
    }

})
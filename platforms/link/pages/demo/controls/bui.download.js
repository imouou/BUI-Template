loader.define(function(require, exports, module, global) {

    // 初始化文件管理控件
    // 初始化控件
    var uiDownload = bui.download({
        needNative: true
    });

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
           output: "",
        },
        methods: {
            downloadImage() {
                let that = this;
                // 开始下载
                uiDownload.start({
                    url: "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1208/24/c2/13179846_1345796441964.jpg",
                    fileName: "customName.jpg",
                    onSuccess: function(url, file) {
    
                        // 获得文件路径
                        that.output = url;
                        
    
                        // 插入图片
                        // this.toBase64({
                        //     data: url,
                        //     onSuccess: function (url) {
    
                        //         $output.append('<img src="'+url+'" width="100%"/>')
                        //     },
                        //     onFail: function (data) {
                        //         bui.alert(data)
                        //     }
                        // })
                    },
                    onFail: function(data) {
                        // bui.alert(data)
                    }
                })
    
            },
            downloadVideo(argument) {
                let that = this;

                uiDownload.start({
                    // url: "http://vjs.zencdn.net/v/oceans.mp4",
                    url: "https://www.zhangxinxu.com/study/media/cat2.mp4",
                    onSuccess: function(url, file) {
                        that.output = url;

                    },
                    onFail: function(data) {
                        bui.alert(data)
                    }
                })
    
            },
            getDownloadApp(argument) {
                let that = this;
                //
                uiDownload.start({
                    url: "http://www.easybui.com/downloads/source/bui/release/bui_demo_dcloud.apk",
                    onSuccess: function(url, file) {
                        that.output = url;
                        // 打开以后安装
                        app.openFile(url, "apk", function(argument) {
                            bui.hint("打开成功")
                        })
                    },
                    onFail: function(data) {
                        // bui.alert(data)
                    }
                })
        
            },
            stopDownload(argument) {
                uiDownload.stop();
            },
            getDownloadOpen(argument) {
                let that = this;
                // 如果有同名文件直接打开
                uiDownload.getFile({
                    url: "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1208/24/c2/13179846_1345796441964.jpg",
                    fileName: "customName.jpg",
                    onSuccess: function(url) {
                        that.output = url;
                        // 打开
                        uiDownload.open({
                            url: url
                        });
    
                    }
                })
            },
            getDownloadShow(argument) {
                let that = this;
                uiDownload.getFile({
                    url: "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1208/24/c2/13179846_1345796441964.jpg",
                    fileName: "customName.jpg",
                    onSuccess: function(data) {
    
                        // 插入图片
                        uiDownload.toBase64({
                            data: data,
                            onSuccess: function(url) {
    
                                that.output = '<img src="' + url + '" width="100%"/>';
                            },
                            onFail: function(data) {
                                bui.alert(data)
                            }
                        })
                    }
                })
            },
            removeDownload(argument) {
                let that = this;
                // 下载的文件默认保存在 download 目录下
                uiDownload.removeFile({
                    folderName: "download",
                    fileName: "customName.jpg",
                    onSuccess: function(data) {
                        bui.alert("删除成功")
                    },
                    onFail: function(err) {
                        bui.alert(err)
                    }
                })
            },
            removeAllDownload(argument) {
                // 下载的文件默认保存在 download 目录下
                uiDownload.removeFolder({
                    folderName: "download",
                    onSuccess: function(data) {
                        bui.alert("删除目录成功")
                    },
                    onFail: function(err) {
                        bui.alert(err)
                    }
                })
            },
            downloadpdf(argument) {
                let that = this;
                // 开始下载
                uiDownload.getFile({
                    url: "http://www.gov.cn/zhengce/pdfFile/2019_PDF.pdf",
                    fileName: "customName.pdf",
                    onSuccess: function(url, file) {
                        // 打开
                        uiDownload.open({
                            url: url
                        });
                        that.output = url
                        // 获得文件路径
                    },
                    onFail: function(data) {
                        // bui.alert(data)
                    }
                })
            },
            nativeDownload(opt){
                // 原生下载，下载的文件安卓会到相册中，IOS则在应用里，无法显示，只能通过link方法去管理；
                var savePath = "";

                app?.getAppDirectoryEntry(function(res){
                    //区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
                    if(bui.platform.isAndroid()){
                        savePath=res.sdcard;                     
                    }else if(bui.platform.isIos()){
                        savePath=res.documents;
                    }
                
                    //下载文件
                    var uiAjax =new FileTransfer();
                    var uri= encodeURI(opt.url);
                    var filePath=savePath+"/"+opt.fileName ;
                    
                    uiAjax.download(
                        uri,
                        filePath,
                    function(entry){
    
                        opt.onSuccess && opt.onSuccess.call(module, entry.nativeURL, entry);
                    }, function (error) {
        
                        opt.onFail && opt.onFail.call(module, error);
                    }, false, {
                        headers: opt.headers || {}
                    });
                });
            },
            downloadImagePublic(opt) {
                let that = this;
                // 开始下载
                this.nativeDownload({
                    url: "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1208/24/c2/13179846_1345796441964.jpg",
                    fileName: "customName.jpg",
                    onSuccess: function(url, file) {

                        // 获得文件路径
                        that.output = url;
                        
                    },
                    onFail: function(data) {
                        // bui.alert(data)
                    }
                })
            }
        },
        watch: {},
        computed: {},
        templates: {},
        mounted: function(){
            // 数据解析后执行
        }
    })


})
loader.define(function(require, exports, module, global) {

    var uiUpload = bui.upload({
        showProgress: true,
    });

    // 上拉菜单 js 初始化:
    var uiActionsheet = bui.actionsheet({
        trigger: "#btnUpload",
        buttons: [{ name: "拍照上传", value: "camera" }, { name: "从相册选取", value: "photo" }],
        callback: function(e) {
            var ui = this;
            var val = $(e.target).attr("value");

            switch (val) {
                case "camera":
                    ui.hide();
                    uiUpload.add({
                        "from": "camera",
                        // "needCompress": true, // 1.5.3新增压缩
                        // "width": 300,
                        "destinationType": "file", //  file | blob | data 
                        "onSuccess": function(val, data) {
                            // bui.alert(val)
                            // 展示base64本地图片 建议直接调用start方法上传以后再展示远程地址,避免应用崩溃
                            this.toBase64({
                                onSuccess: function(url) {
                                    bs.photos.unshift({
                                        name: data.name,
                                        url:url
                                    })
                                    // $uploadBtn.before(templatePhoto(url))
                                },
                                onFail: function(url) {
                                    bui.alert(url)
                                        // $uploadBtn.before(templatePhoto(url))
                                }
                            });
                            // 直接调用start上传图片

                            // this.start({
                            //     url: "https://imgurl.org/upload/ftp",
                            //     data: {
                            //         test: 111,
                            //         file: this.data().file
                            //     },
                            //     onSuccess: function(data) {
                            //         bui.alert(data);
                            //         // 成功
                            //     },
                            //     onFail: function(data) {
                            //         console.log(data, "fail");
                            //         // 失败
                            //     },
                            // })

                        }
                    })

                    break;
                case "photo":
                    ui.hide();
                    uiUpload.add({
                        "from": "",
                        "onSuccess": function(val, data) {

                            // 展示base64本地图片 建议直接调用start方法上传以后再展示远程地址,避免应用崩溃
                            this.toBase64({
                                onSuccess: function(url,data) {
                                    bs.photos.unshift({
                                        name: data.name,
                                        url:url
                                    })
                                    // $uploadBtn.before(templatePhoto(url))

                                }
                            });
                            // bui.alert(val)
                            // this.start({
                            //     header: {},
                            //     url: "https://imgurl.org/upload/ftp",
                            //     onSuccess: function(data) {
                            //         bui.alert(data);
                            //         // 成功
                            //     },
                            //     onFail: function(data) {
                            //         console.log(data, "fail");
                            //         // 失败
                            //     },
                            // })

                        }
                    })

                    break;
                case "cancel":
                    ui.hide();
                    break;
            }
        }
    })

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
            photos:[]
        },
        methods: {
            removeSelect(argument) {
                // 删除第1个
                this.photos.shift();

                uiUpload.remove(0);
            },
            removeAllSelect(argument) {

                // 删除所有
                this.photos = [];

                uiUpload.clear();
        
            },
            upload(argument) {
                uiUpload.start({
                    // url: "http://eid.bingosoft.net:83/share/apis/upload/image",
                    url: "https://imgurl.org/upload/ftp",
                    // url: "https://www.swla.com.cn/demo/upload.asp",
                    // url:"http://10.201.78.23:81/dataservice.ashx?CommandName=Atd$ImgUpLoad",
                    onSuccess: function(data) {
                        bui.alert(data)
                            //显示上传以后的图片
                            //清空已经选择的图片
                    },
                    onFail: function(data) {
                        bui.alert(data)
                    },
                    onEnd: function(res) {
                        console.log(res)
                        console.log(res.length)
                    }
                })
    
            },
            stopUpload(argument) {

                uiUpload.stop();
        
            },
            removePhoto(that){
                var $item = $(that).parents(".span1");
                var index = $item.index();
                var name = $item.attr("data-name");
        
                // 删除对应的上传数据
                uiUpload.remove(name);
                
                // 删除数据和dom
                this.photos.splice(index,1);
            
            },
            selectMore(){
                let that = this;
                uiUpload.addMore({
                    "from": "photo",
                    "onSuccess": function(val, data) {

                        // $output.text(val);
                        let _upload = this;
                        for(let i=0;i<data.length;i++){

                            let img = data[i];

                            (function(item){

                                // 插入多张图片
                                _upload.toBase64({
                                    data: item.data,
                                    onSuccess: function (url) {
                                        
                                        item.url = url;
                                        // console.log(html)
                                        // // 最后一个
                                        // if( data.length-1 == i){
                                        //     // that.output = html;
                                        // }

                                        that.photos.unshift(item)

                                    },
                                    onFail: function (err) {
                                        bui.alert(err)
                                    }
                                });
                                
                            })(img);

                        }
                        // 展示base64本地图片 建议直接调用start方法上传以后再展示远程地址,避免应用崩溃
                        // this.toBase64({
                        //     onSuccess: function(url,data) {
                        //         bs.photos.unshift({
                        //             name: data.name,
                        //             url:url
                        //         })
                        //         // $uploadBtn.before(templatePhoto(url))

                        //     }
                        // });

                        // this.startAll({
                        //     header: {},
                        //     url: "https://imgurl.org/upload/ftp",
                        //     onSuccess: function(data) {
                        //         bui.alert(data);
                        //         // 成功
                        //     },
                        //     onFail: function(data) {
                        //         console.log(data, "fail");
                        //         // 失败
                        //     },
                        // })

                    }
                })
            
            },
            uploadAll(that){
                // 多次上传，一次一个文件
                uiUpload.startAll({
                    // url: "http://eid.bingosoft.net:83/share/apis/upload/image",
                    url: "https://imgurl.org/upload/ftp",
                    // url: "https://www.swla.com.cn/demo/upload.asp",
                    // url:"http://10.201.78.23:81/dataservice.ashx?CommandName=Atd$ImgUpLoad",
                    onSuccess: function(data) {
                        bui.alert(data)
                            //显示上传以后的图片
                            //清空已经选择的图片
                    },
                    onFail: function(data) {
                        bui.alert(data)
                    },
                    onEnd: function(res) {
                        console.log(res)
                        console.log(res.length)
                    }
                })
            
            },
            uploadOneMore(){
                // 一次上传多个文件
                let files = [];
                let data = uiUpload.data();

                data.forEach((item,index)=>{
                    // file文件字段
                    files.push(item.data)
                })

                uiUpload.start({
                    url: "https://imgurl.org/upload/ftp",
                    data: {
                        file: files
                    },
                    onSuccess: function (res) {
                        // 成功
                    },
                    onFail: function (res,status) {
                        // 失败 status = "timeout" || "error" || "abort", "parsererror"
                    }
                })
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplPhoto(data) {
                let html = "";
                data.forEach((item,index)=>{
                    let url = item.url;
                    html +=`<div class="span1" data-name="${item.name}">
                        <div class="bui-upload-thumbnail"><img src="${url}" alt="" /><i class="icon-removefill" b-click="page.removePhoto($this)"></i></div>
                    </div>`
                })
                return html;
            }
        },
        mounted: function(){
            // 数据解析后执行
        }
    })



})
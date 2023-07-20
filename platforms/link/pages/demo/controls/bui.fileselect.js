loader.define(function (require, exports, module, global) {

    var uiFileSelect = bui.fileselect({
        // needNative: true
    });

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
            output: "",
            photos: [],
        },
        methods: {
            select(argument) {
                let that = this;
                uiFileSelect.add({
                    from: "photo",  // camera
                    "onSuccess": function (val, data) {
                        // $output.text(val);
                        
                        // 插入本地图片
                        this.toBase64({
                            onSuccess: function (url) {

                                that.output = '<img src="' + url + '" alt="" />';
                            },
                            onFail: function (err) {
                                bui.alert(err)
                            }
                        });

                    },
                    "onFail": function (err) {
                        bui.alert(err)

                    }
                })

            },
            selectMore(argument) {
                let that = this;
                let html = '';

                uiFileSelect.addMore({
                    from: "photo",  // camera
                    "onSuccess": function (val, data) {
                        // $output.text(val);
                        let fileselect = this;

                        for(let i=0;i<data.length;i++){

                            let img = data[i];

                            (function(item){

                                // 插入多张图片
                                fileselect.toBase64({
                                    data: item.data,
                                    onSuccess: function (url) {
                                        
                                        html += '<img src="' + url + '" alt="" />';

                                        // 最后一个
                                        if( data.length-1 == i){
                                            that.output = html;
                                        }

                                    },
                                    onFail: function (err) {
                                        bui.alert(err)
                                    }
                                });
                                
                            })(img);

                        }
                        
                    },
                    "onFail": function (err) {
                        bui.alert(err)

                    }
                })

            },
            camera(argument) {
                let that = this;
                uiFileSelect.add({
                    from: "camera",  // camera
                    "onSuccess": function (val, data) {
                        // $output.text(val);
                        // 插入本地图片
                        this.toBase64({
                            onSuccess: function (url) {
                                that.output = '<img src="' + url + '" alt="" />';
                            },
                            onFail: function (argument) {
                            }
                        });

                    }
                })

            },
            getSelect(argument) {

                bui.alert(uiFileSelect.data());

            },
            removeSelect(argument) {

                // 安卓选择后的文件名会自动改名为 resize.jpg 
                uiFileSelect.remove("resize.jpg");

            },
            removeAllSelect(argument) {

                uiFileSelect.clear();

            }
        },
        watch: {},
        computed: {},
        templates: {},
        mounted: function () {
            // 数据解析后执行
        }
    })

})

loader.define(function (require, exports, module, global) {


    var uiFile = bui.file({
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
            createFolder(argument) {
                // 创建download文件夹
                let that = this;
                uiFile.getFolder({
                    folderName: "download",
                    create: true,
                    onSuccess: function (folder) {
                        that.output = folder.nativeURL;
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })
            },
            getFolder(argument) {
                // 获取download文件夹
                let that = this;

                uiFile.getFolder({
                    folderName: "download",
                    onSuccess: function (folder) {
                        that.output = folder.nativeURL;
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })
            },
            removeFolder(argument) {
                let that = this;
                // 删除文件夹

                uiFile.removeFolder({
                    folderName: "download",
                    onSuccess: function (data) {
                        that.output = "";
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })

            },
            createFile(argument) {
                let that = this;
                // 创建图片文件

                uiFile.getFile({
                    folderName: "download",
                    fileName: "bui.jpg",
                    create: true,
                    onSuccess: function (file) {
                        that.output = file.nativeURL;
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })
            },
            getFile(argument) {
                let that = this;
                // 获取图片文件

                uiFile.getFile({
                    folderName: "download",
                    fileName: "bui.jpg",
                    onSuccess: function (file) {

                        // // 打开图片
                        this.open({
                            url: file.nativeURL
                        });
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })
            },
            removeFile(argument) {
                let that = this;
                // 移除图片文件

                uiFile.removeFile({
                    folderName: "download",
                    fileName: "bui.jpg",
                    onSuccess: function (data) {
                        that.output = ""
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })
            },
            writeFile(argument) {
                let that = this;
                // 创建写入文本文件

                uiFile.getFile({
                    folderName: "download",
                    fileName: "bui.txt",
                    create: true,
                    onSuccess: function (file) {
                        that.output = file.nativeURL;

                        this.writeFile({
                            file: file,
                            content: "bui is Easy and fast"
                        })
                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })

            },
            readFile(argument) {
                let that = this;
                // 读取文件

                uiFile.getFile({
                    folderName: "download",
                    fileName: "bui.txt",
                    onSuccess: function (file) {

                        this.readFile({
                            file: file,
                            onSuccess(content) {
                                that.output = content;
                            }
                        })

                    },
                    onFail: function (err) {
                        bui.alert(err)
                    }
                })
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

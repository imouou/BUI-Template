// 单页路由
window.router = bui.router();
// 本地存储
window.storage = bui.storage();

// 需要登录的名单页面
var roleList = ["pages/personal/index"];

// 全局登录页
bui.ready(function(global) {


    // 初始化数据行为存储
    window.store = bui.store({
        el: "#bui-router",
        scope: "app",
        data: {
            isLogin: false, // 用户的登录状态, 所有页面只需要控制 store.isLogin = false; 就会退出登录.
        },
        methods: {
            checkLogin: function() {
                // 获取本地用户信息
                var userinfo = storage.get("userinfo", 0);
                // 登录成功才会写入用户信息, 正常是需要拿token跟后台比对token是否过期才能来判断用户是否登录状态
                if (userinfo && userinfo.username) {
                    this.isLogin = true;
                    return true;
                } else {
                    this.isLogin = false;
                }
                return false;
            },
            insertLogin: function() {
                var uiLoginPage = bui.page({
                    url: "pages/login/login.html",
                    param: {
                        type: "page" // 给登录页判断是什么方式加载
                    }
                })

                // 登录成功以后执行关闭窗口及刷新操作
                bui.on("loginsuccess", function() {
                    // console.log(this)
                    uiLoginPage.close();
                    bui.refresh();
                })

                return uiLoginPage;
            },
            bind: function() {
                // 绑定页面的所有按钮有href跳转
                bui.btn({ id: "#bui-router", handle: ".bui-btn" }).load();

                // 统一绑定页面所有的后退按钮
                $("#bui-router").on("click", ".btn-back", function(e) {
                    // 支持后退多层,支持回调
                    bui.back();
                })
            }
        },
        watch: {
            isLogin: function(val) {
                // 改变的时候才会删除掉用户信息
                if (val === false) {
                    // 删除登录信息
                    storage.remove("userinfo");

                    // 插入登录页
                    // this.insertLogin();
                }
            }
        },
        mounted: function() {
            var that = this;
            // 绑定页面跳转
            this.bind();

            // 每个页面的权限
            that.checkLogin();

            // 配置每个component都加上权限
            // bui.config.define = {
            //     beforeLoad: function() {
            //         // 如果未登录,且在必须登录名单里面, 不允许执行
            //         if (!that.isLogin && bui.array.compare(roleList, this.moduleName)) {
            //             return false;
            //         }
            //     }
            // }



            // 初始化路由
            router.init({
                id: "#bui-router",
                store: this
            });

        }
    })


})
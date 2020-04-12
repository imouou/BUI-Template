// 单页路由
window.router = bui.router();
// 本地存储
window.storage = bui.storage();

// 全局登录页
bui.ready(function() {

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
                if (userinfo && userinfo.username) {
                    this.isLogin = true;
                    return true;
                } else {
                    // 必须登录
                    this.isLogin = false;
                }
                return false;
            },
            insertLogin: function() {
                var uiLoginPage = bui.page({
                    url: "main",
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
                    // 如果有登录页历史
                    if (bui.history.get("main")) {
                        // 后退到首页
                        bui.back({
                            name: "main"
                        })
                    } else {
                        // 插入登录页
                        this.insertLogin();
                    }

                }
            }
        },
        mounted: function() {
            var that = this;
            // 绑定页面跳转
            this.bind();

            // 每个页面的权限
            that.checkLogin();


            // 初始化路由
            router.init({
                id: "#bui-router",
                // 配置首页为登录页
                indexModule: {
                    template: "pages/login/login.html",
                    script: "pages/login/login.js",
                },
                // 把store 挂载到路由上
                store: this,
                loaded: function(e) {
                    // 自动登录跳过登录页
                    if (e.target.pid === "main" && store.$data.isLogin) {
                        // 如果已经登录,跳过登录页
                        bui.load({
                            url: "pages/main/main.html"
                        })
                    }

                    // 防止webapp 可以直接跳转到某个页面, app 则没有这个问题
                    if (e.target.pid !== "main" && !store.$data.isLogin) {
                        // 插入页面
                        store.insertLogin();
                    }
                }
            });

        }
    })


})
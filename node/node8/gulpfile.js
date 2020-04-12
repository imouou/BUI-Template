// gulp依赖
var gulp = require('gulp'),
    // 生成css,js map图
    sourcemaps = require('gulp-sourcemaps'),
    // 错误处理
    plumber = require('gulp-plumber'),
    // html压缩
    htmlmin = require('gulp-htmlmin'),
    // 图片压缩
    imagemin = require('gulp-imagemin'),
    // CSS编译
    // sass = require('gulp-sass'),
    minifycss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    // 脚本压缩
    uglify = require('gulp-uglify'),
    // 静态服务器
    connect = require('gulp-connect'),
    // 跨域代理
    proxy = require('http-proxy-middleware'),
    // ES6 转ES5
    babel = require('gulp-babel'),
    // 读写保存配置
    fs = require("fs-extra"),
    // 配合fs
    path = require("path"),
    // 配合watch增删改
    watch = require('gulp-watch'),
    // 配合watch增删改
    batch = require('gulp-batch'),
    // 任务同步并行
    sequence = require('gulp-sequence'),
    // 只修改改动的文件
    changed = require('gulp-changed'),
    // 生成样式脚本?的引入
    md5 = require('gulp-md5-assets'),
    // 删除文件
    del = require('del');
// less 编译
const less = require('gulp-less');
// 加入二维码
var qrcode = require('qrcode-terminal');
// 用于获取本机信息
var os = require('os');
var ip = getNetwork().ip || "localhost";

var package = require('./package.json');
// 同步刷新
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// 获取package的项目配置
var configName = package['projects'] && package['projects'][process.env.NODE_ENV] || 'app.json';

var app = require("./" + configName),
    // 编译服务配置
    distServer = app.distServer || {},
    // 开发服务配置
    devServer = app.devServer || {},
    // 实时刷新,仅在开发模式
    isDevLivereload = devServer.livereload == false ? false : true,
    // 实时刷新,仅在编译模式
    isDistLivereload = distServer.livereload == false ? false : true,
    // 源文件目录
    sourcePath = process.env.NODE_ENV ? process.env.NODE_ENV + '/src' : 'src',
    // 源文件目录
    sourceBuild = process.env.NODE_ENV ? process.env.NODE_ENV + '/dist' : 'dist';

// 配置编译的服务
var config = {
    source: {
        // 源文件目录
        root: sourcePath,
        // 源文件样式目录
        css: [sourcePath + "/css/**/*.css"],
        // style.css 源文件目录
        scss: [sourcePath + '/scss/**/*.scss'],
        // style.css 源文件目录
        less: [sourcePath + '/less/**/*.less', '!' + sourcePath + '/less/**/_*.less'],
        // 源文件图片目录
        images: [sourcePath + '/**/*.{png,jpg,gif,ico}'],
    },
    // 编译的输出路径
    build: sourceBuild,
    // 输出配置
    output: {
        // 输出的根目录
        root: sourceBuild,
        // 输出的样式目录
        css: sourceBuild + '/css',
        images: sourceBuild + '/'
    },
    watcher: {
        rootRule: sourcePath + '/**',
        moveRule: [sourcePath + '/**', '!' + sourcePath + '/scss'],
        jsRule: [sourcePath + '/**/*.js', '!' + sourcePath + '/js/bui.js', '!' + sourcePath + '/js/zepto.js', '!' + sourcePath + '/js/platform/**/*.js', '!' + sourcePath + '/js/plugins/**/*.js', '!' + sourcePath + '/**/*.min.js', '!' + sourcePath + '/**/*.json'],
        htmlRule: [sourcePath + '/**/*.html'],
    }
}

// 增加用户配置的忽略文件
if ("ignored" in app) {
    app.ignored.forEach(function(item, index) {
        var type = item.substr(item.lastIndexOf(".") + 1);
        switch (type) {
            case "css":
                config.source.css.push(item);
                break;
            case "scss":
                config.source.scss.push(item);
                break;
            case "less":
                config.source.less.push(item);
                break;
            case "png":
            case "jpg":
            case "gif":
            case "jpeg":
                config.source.images.push(item);
                break;
            case "js":
                config.watcher.jsRule.push(item);
                break;
            case "html":
                config.watcher.htmlRule.push(item);
                break;
            default:
                config.watcher.moveRule.push(item);
                break;
        }
    })
}

// 获取本机IP
function getNetwork() {
    let iptable = {},
        ifaces = os.networkInterfaces();

    for (let dev in ifaces) {
        ifaces[dev].forEach(function(details, alias) {
            if (details.family == 'IPv4') {
                iptable[dev + (alias ? ':' + alias : '')] = details.address;
                iptable["ip"] = details.address;
            }
        });
    }

    return iptable;
}

// 获取随机端口
function getRandomPort() {
    let random = Math.random() * 10000 + 1000;
    let randomPort = parseInt(random);

    return randomPort;
}

// 获取端口并写入配置
function getServerPort() {

    // 开发版运行端口
    let devPort = getRandomPort();
    // 编译版运行端口
    let distPort = devPort + 2;
    // 写入端口
    if (!devServer.port) {
        app.devServer.port = devPort;
        fs.writeFileSync(path.resolve(configName), JSON.stringify(app, null, 2));
    }
    if (!distServer.port) {
        app.distServer.port = distPort;
        fs.writeFileSync(path.resolve(configName), JSON.stringify(app, null, 2));
    }

    return {
        devPort: app.devServer.port,
        distPort: app.distServer.port
    }
}


// 清空文件,在最后构建的时候才加入这部
gulp.task('clean-dist', cb => {
    return del([sourceBuild + '/**/*'], cb);
});

// less 初始化的时候编译, 并生成sourcemap 便于调试
gulp.task('less', function() {
    return gulp.src(config.source.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sourceBuild + "/css"))
        .pipe(gulp.dest(sourcePath + "/css"))
});
// less 初始化的时候编译, 并生成sourcemap 便于调试
gulp.task('less-build', function(cb) {
    del([sourceBuild + '/css/*.css.map']);
    return gulp.src(config.source.less)
        .pipe(less())
        .pipe(gulp.dest(sourceBuild + "/css"))
        .pipe(gulp.dest(sourcePath + "/css"))
});
// sass 初始化的时候编译, 并生成sourcemap 便于调试
// gulp.task('scss', function() {

//     return gulp.src(config.source.scss)
//         .pipe(changed(sourceBuild + '/css/'))
//         // 生成css对应的sourcemap
//         .pipe(sourcemaps.init())
//         .pipe(sass(app.sass).on('error', sass.logError))
//         .pipe(autoprefixer(app.autoprefixer))
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest(sourceBuild + "/css"))
//         .pipe(gulp.dest(sourcePath + "/css"))
// });
// // sass 编译成压缩版本
// gulp.task('scss-build', function() {
//     return gulp.src(config.source.scss)
//         .pipe(sass(app.sass).on('error', sass.logError))
//         .pipe(autoprefixer(app.autoprefixer))
//         .pipe(gulp.dest(sourceBuild + "/css"))
//         .pipe(gulp.dest(sourcePath + "/css"))
//         .pipe(minifycss(app.cleanCss))
//         .pipe(reload({ stream: true }));
// });
// css 编译
gulp.task('css', function() {
    // 编译style.scss文件
    return gulp.src(config.source.css)
        .pipe(changed(sourceBuild + '/css/'))
        .pipe(gulp.dest(config.output.css))
        // .pipe(md5(10, sourceBuild+"/**/*.html"))
        // .pipe(reload({stream: true}));
})

// 改变的时候才执行压缩
gulp.task('css-minify', function() {
    // 编译style.scss文件
    return gulp.src(config.source.css)
        // .pipe(changed(sourceBuild + '/css/'))
        .pipe(minifycss(app.cleanCss))
        .pipe(gulp.dest(config.output.css))
})

// 处理完JS文件后返回流
gulp.task('js-babel', function() {

    return gulp.src(config.watcher.jsRule)
        // error end task
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error)
                this.emit('end');
            }
        }))
        // translate es5
        .pipe(babel(app.babel))
        .pipe(gulp.dest(config.output.root))
});
// 脚本 编译
gulp.task('js-minify', function() {
    return gulp.src(config.watcher.jsRule)
        // .pipe(changed(config.output.root))
        // error end task
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error)
                this.emit('end');
            }
        }))
        .pipe(babel(app.babel))
        .pipe(uglify(app.uglify))
        .pipe(gulp.dest(config.output.root))
        .pipe(md5(10, sourceBuild + '/**/*.html'));
});


// 把bui需要的文件移动过去
gulp.task('move-bui', function() {

    gulp.src([sourcePath + '/css/bui.css'])
        .pipe(gulp.dest(sourceBuild + '/css/'))
    gulp.src([sourcePath + '/js/bui.js'])
        .pipe(gulp.dest(sourceBuild + '/js/'))
    gulp.src([sourcePath + '/js/platform/*.js'])
        .pipe(gulp.dest(sourceBuild + '/js/platform/'))
});
// move all file except pages/js/** .sass .md
gulp.task('move', function() {
    return gulp.src(config.watcher.moveRule)
        .pipe(changed(config.watcher.rootRule))
        .pipe(gulp.dest(config.output.root));
});

// compress html
gulp.task('html', function() {
    var options = app.htmlmin;
    return gulp.src(config.watcher.htmlRule)
        .pipe(changed(sourceBuild))
        .pipe(plumber())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(sourceBuild))
        // .pipe(md5(10))
        // .pipe(reload({stream: true}))
});

// compress image
gulp.task('images', function() {
    // 有大图会很慢,默认不开启
    if (app.imagemin) {
        return gulp.src(config.source.images)
            .pipe(changed(config.output.images))
            .pipe(imagemin(app.imagemin))
            .pipe(gulp.dest(config.output.images));
    } else {
        return gulp.src(config.source.images)
            .pipe(changed(config.output.images))
            .pipe(gulp.dest(config.output.images));
    }
});


// 同步服务
gulp.task('server-sync', ['server-build'], function() {
    var portObj = getServerPort();

    let proxys = [];
    if ("proxy" in app) {
        let proxyObj = app["proxy"];
        let keys = Object.keys(proxyObj);

        keys.forEach(function(item, i) {
            let proxyItem = proxy(item, proxyObj[item])
            proxys.push(proxyItem);
        })
    }

    // 起一个同步服务
    browserSync.init({
        ui: {
            port: portObj.distPort + 1
        },
        server: {
            baseDir: sourceBuild,
            middleware: proxys
        },
        port: portObj.distPort,
        ghostMode: false,
        notify: false,
        codeSync: isDistLivereload,
        // plugins: ['bs-console-qrcode']
    });

    // 插入二维码,手机扫码调试
    var qrurl = "http://" + ip + ":" + portObj.distPort + app.qrcode;

    qrcode.generate(qrurl, { small: true });
    console.log("手机扫码预览效果");

    // 新增删除由插件负责
    watch(config.watcher.rootRule)
        .on('add', addFile)
        .on('change', changeFile)
        .on('unlink', function(file) {
            //删除文件
            let distFile = './' + sourceBuild + '/' + path.relative('./' + sourcePath, file); //计算相对路径
            fs.existsSync(distFile) && fs.unlink(distFile);
            console.warn(file, "deleted")
        });


});

// 起一个src目录的server
gulp.task('server', function() {
    var portObj = getServerPort();

    let proxys = [];
    if ("proxy" in app) {
        let proxyObj = app["proxy"];
        let keys = Object.keys(proxyObj);

        keys.forEach(function(item, i) {
            let proxyItem = proxy(item, proxyObj[item])
            proxys.push(proxyItem);
        })
    }

    // 起一个同步服务
    browserSync.init({
        ui: {
            port: portObj.devPort + 1
        },
        server: {
            baseDir: sourcePath,
            middleware: proxys
        },
        port: portObj.devPort,
        ghostMode: false,
        codeSync: isDevLivereload
    });

    // 插入二维码,手机扫码调试
    var qrurl = "http://" + ip + ":" + portObj.devPort + app.qrcode;
    qrcode.generate(qrurl, { small: true });

});

// 监测新增
function addFile(file) {
    console.log(file, "added");
    gulp.src(file, { base: './' + sourcePath }) //指定这个文件
        .pipe(gulp.dest('./' + sourceBuild))


}
// 监测新增

function changeFile(file) {
    console.info(file, "changed");

    let isJs = file.lastIndexOf(".js") > -1 && file.lastIndexOf(".json") < 0;
    let isHtml = file.lastIndexOf(".html") > -1;
    let isScss = file.lastIndexOf(".scss") > -1;
    let isCss = file.lastIndexOf(".css") > -1;
    let isLess = file.lastIndexOf(".less") > -1;

    if (isJs) {
        gulp.src(file, { base: './' + sourcePath }) //指定这个文件
            .pipe(plumber({
                errorHandler: function(error) {
                    console.log(error)
                    this.emit('end');
                }
            }))
            // translate es5
            .pipe(babel(app.babel))
            .pipe(gulp.dest('./' + sourceBuild))
            .pipe(reload({ stream: true }))
            .pipe(md5(10, sourceBuild + '/**/*.html'))
    } else if (isLess) {

        gulp.src(config.source.less)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('./'))
            .pipe(dest(sourceBuild + "/css"))
            .pipe(dest(sourcePath + "/css"))
            .pipe(reload({ stream: true }));

    } else if (isHtml) {

        gulp.src(file, { base: './' + sourcePath })
            .pipe(plumber())
            .pipe(htmlmin(app.htmlmin))
            .pipe(gulp.dest('./' + sourceBuild))
            .pipe(md5(10))
            .pipe(reload({ stream: true }))
    } else if (isCss) {

        gulp.src(file, { base: './' + sourcePath })
            .pipe(gulp.dest('./' + sourceBuild))
            .pipe(md5(10, sourceBuild + "/**/*.html"))
            .pipe(reload({ stream: true }))
    } else {
        gulp.src(file, { base: './' + sourcePath })
            .pipe(gulp.dest('./' + sourceBuild))
            .pipe(reload({ stream: true }))
    }

}


// 编译任务以后,缺省任务的服务才能跑起来
gulp.task('build', sequence('clean-dist', 'move', 'move-bui', ['html'], ['css-minify'], ['images'], 'less-build', ['js-minify']));

// 先编译再起服务,不需要每次都清除文件夹的内容 如果有scss目录,会在最后才生成, 如果没有,则以src/css/style.css 作为主要样式
gulp.task('server-build', sequence('move', 'move-bui', ['html'], ['css'], ['images'], 'less', ['js-babel']));

// 注册缺省任务,启动服务,并且监听文件修改并且编译过去
gulp.task('dev', ['server-sync']);

gulp.task('default', ['dev']);
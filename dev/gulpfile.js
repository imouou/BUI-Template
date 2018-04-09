
// gulp依赖
var gulp = require('gulp'),
    // 生成css,js map图
    sourcemaps = require('gulp-sourcemaps'),
    // 实时刷新,在BUI中,实时刷新会导致不能后退
    livereload = require('gulp-livereload'),
    // 错误处理
    plumber = require('gulp-plumber'),
    // html压缩
    htmlmin = require('gulp-htmlmin'),
    // 图片压缩
    imagemin = require('gulp-imagemin'),
    // CSS编译
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    // 脚本压缩
    uglify = require('gulp-uglify'),
    // 静态服务器
    connect = require('gulp-connect'),
    // 跨域代理
    proxy = require('http-proxy-middleware'),
    // ES6 转ES5
    babel = require('gulp-babel'),
    // 打开浏览器
    open = require("open"),
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
    // 用于获取本机信息
    os=require('os');

// 获取默认配置
var configName = "app.json",
    app = require("./"+configName),
    // 编译服务配置
    distServer = app.distServer || {},
    // 开发服务配置
    devServer = app.devServer || {},
    // 实时刷新,仅在开发模式
    isLivereload = devServer.livereload,
    // 实时刷新,仅在编译模式
    isDistLivereload = distServer.livereload || false,
    // 源文件目录
    sourcePath = devServer.root || '',
    // 源文件目录
    sourceBuild = distServer.root || '';

// 配置编译的服务
var config = {
        source : {
            // 源文件目录
            root: sourcePath,
            // 源文件样式目录
            css: sourcePath+'/css',
            // style.css 源文件目录
            scss: sourcePath+'/scss/**/*.scss',
            // 源文件图片目录
            images: sourcePath+'/**/*.{png,jpg,gif,ico}',
        },
        // 编译的输出路径
        build: sourceBuild,
        // 输出配置 
        output: {
            // 输出的根目录
            root: sourceBuild,
            // 输出的样式目录
            css: sourceBuild+'/css',
            images: sourceBuild+'/'
        },
        watcher : {
            rootRule: sourcePath+'/**',
            scssRule: [sourcePath+'/**/*.scss','!'+sourcePath+'/scss/**/*.scss','!'+sourcePath+'/scss/**/_*.scss'],
            jsRule: sourcePath+'/**/*.js',
            htmlRule: [sourcePath+'/**/*.html'],
        }
}

// 获取本机IP
function getNetwork() {
    let iptable = {},
        ifaces  = os.networkInterfaces();

    for (let dev in ifaces) {
      ifaces[dev].forEach(function(details,alias){
        if (details.family=='IPv4') {
          iptable[dev+(alias?':'+alias:'')]=details.address;
        }
      });
    }

    return iptable;
}

// 获取随机端口
function getRandomPort() {
    let random = Math.random()*10000;
    let randomPort = parseInt(random);

    return randomPort;
}

// 获取端口
function getServerPort() {

    // 开发版运行端口
    let devPort = getRandomPort();
    // 编译版运行端口
    let distPort = devPort+1;
    // 写入端口
    if( !devServer.port ){
        app.devServer.port = devPort;
        fs.writeFileSync(path.resolve(configName), JSON.stringify(app, null, 2));
    }
    if( !distServer.port ){
        app.distServer.port = distPort;
        fs.writeFileSync(path.resolve(configName), JSON.stringify(app, null, 2));
    }

    return {
        devPort: app.devServer.port,
        distPort: app.distServer.port
    }
}

// 启动开发服务并且允许处理接口跨域
gulp.task('server', function() {
    
    // 获取端口
    var portObj = getServerPort(),
        network = getNetwork(),
        ip = network["en0:1"] || "localhost";
    // console.log(ip["en0:1"])

    connect.server({
        root: app.devServer.root,
        port: portObj.devPort,
        host: '0.0.0.0',
        livereload: isLivereload,
        middleware: function(connect, opt) {

            // 请求代理, 多个不同地址接口在app.proxy 里面新增多个
            open("http://"+ip+":"+portObj.devPort);

            let proxys = [];
            if( "proxy" in app){
                let proxyObj = app["proxy"];
                let keys = Object.keys(proxyObj);

                keys.forEach(function (item,i) {
                    let proxyItem = proxy(item , proxyObj[item])
                    proxys.push(proxyItem);
                })
            }

            return proxys;
        }

    });

});

// 启动编译的服务器
gulp.task('distserver', function() {
    
    // 获取端口
    var portObj = getServerPort(),
        network = getNetwork(),
        ip = network["en0:1"] || "localhost";

    connect.server({
        root: app.distServer.root,
        port: portObj.distPort,
        livereload: isDistLivereload,
        host: '0.0.0.0',
        middleware: function(connect, opt) {
            // 请求代理, 多个不同地址接口在app.proxy 里面新增多个
            open("http://"+ip+":"+portObj.distPort);

            let proxys = [];
            if( "proxy" in app){
                let proxyObj = app["proxy"];
                let keys = Object.keys(proxyObj);

                keys.forEach(function (item,i) {
                    let proxyItem = proxy(item , proxyObj[item])
                    proxys.push(proxyItem);
                })
            }

            return proxys;
        }

    });
});

// sass 编译
gulp.task('scss', function() {
// 编译模块里的scss文件
// 编译style.scss文件
  gulp.src(config.source.scss)
    .pipe(changed(config.source.css))
    // 生成css对应的sourcemap 
    // .pipe(sourcemaps.init())
    .pipe(sass(app.sass).on('error', sass.logError))
    // .pipe(sourcemaps.write('./'))
    // 输出多一份编译的在源码里
    .pipe(gulp.dest(config.source.css))

})

// sass 编译
gulp.task('css', function() {
// 编译style.scss文件
  gulp.src(sourcePath+"/css/**")
    .pipe(changed(config.output.css))
    .pipe(minifycss())
    .pipe(gulp.dest(config.output.css))

})

// 脚本 编译
gulp.task('js',function () {
    gulp.src(config.watcher.jsRule)
        .pipe(changed(config.output.root))
        // error end task
        .pipe(plumber({
            errorHandler : function (error) {
                console.log(error)
                this.emit('end');
            }
        }))
        // translate es5
        .pipe(babel(app.babel))
        // compress script
        // mangle: true,//类型：Boolean 默认：true 是否修改变量名
        // compress: true,//类型：Boolean 默认：true 是否完全压缩
        .pipe(uglify(app.uglify))
        .pipe(gulp.dest(config.output.root));
});

// move all file except pages/js/** .sass .md 
gulp.task('move',function () {
    gulp.src([config.source.root+'/**','!**/*.{html,css,js,scss,less,md,png,jpg,gif,ico}','!'+config.source.root+'/scss'])
        .pipe(changed(config.watcher.rootRule))
        .pipe(gulp.dest(config.output.root));

});

// compress html
gulp.task('html', function () {
    var options = app.htmlmin;
    gulp.src(config.watcher.htmlRule)
        .pipe(changed(sourceBuild))
        .pipe(plumber())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(sourceBuild));
});

// compress image
gulp.task('images',function () {
    gulp.src(config.source.images)
        .pipe(changed(config.output.images))
        .pipe(gulp.dest(config.output.images));
});


// 实时监听 scss, html, js 等的修改
gulp.task('watch', function() {
    // 使用自动刷新会导致BUI调试时,页面无法后退,所以这里默认是关闭的
    isLivereload && livereload.listen();

    // 实时编译样式
    gulp.watch(sourcePath+"/scss/*.scss",['scss']);
    // 编译整个工程目录会导致服务器很卡
    // gulp.watch(sourcePath+"/**/*.js",['js']);
    // gulp.watch(sourcePath+"/**/*.html",['html']);

    // 触发自动刷新
    isLivereload && gulp.watch([sourcePath+"/**/*.{"+devServer.watchfile+"}"]).on('change', livereload.changed);
})


// 编译任务以后,缺省任务的服务才能跑起来
gulp.task('build', sequence('move',['images','html','js','scss'],'css' ) );


// 注册缺省任务,启动服务,并且监听文件修改并且编译过去
gulp.task('dev', ['server','watch']);

// 用于预览编译后的文件
gulp.task('dist', ['distserver']);

gulp.task('default', ['dev']);
// 获取默认配置
var package = require("./package.json"),
    
    devServer = package.devServer || {},

    isLivereload = devServer.livereload,
    // 服务器根目录
    serverRoot = devServer.root || '',
    // 服务器端口
    serverPort = devServer.port || 8000 ,
    // 源文件目录
    sourcePath = devServer.source || '',
    // 源文件目录
    sourceBuild = devServer.build || 'dist',
    // 模块的脚本存放的目录,默认只编译该模块下的脚本 src/pages
    sourceModules = devServer.modules || 'pages',
    // 接口域名
    proxyUrl = package.proxy && package.proxy.host || '',
    // 接口目录
    proxyPath = package.proxy && package.proxy.context || [];

// 通过配置apiurl, 可以实现跨域
var config = {
        // 服务器配置
        server : {
            // 网站的根目录
            root: serverRoot ,
            // 网站的端口
            port: serverPort
        },
        api : {
            // 跨域的接口域名
            host : proxyUrl,
            // 跨域的接口地址,例如: http://www.easybui.com/api/getArticle/id/123, 
            // ajax 请求使用相对路径 url: "api/getArticle/id/123"
            path : proxyPath
        },
        source : {
            // 源文件目录
            root: sourcePath,
            // 源文件样式目录
            css: sourcePath+'/css',
            // style.css 源文件目录
            scss: [sourcePath+'/scss/**/*.scss'],
            // 源文件图片目录
            images: sourcePath+'/images/**/*.{png,jpg,gif,ico}',
        },
        // 编译的输出路径
        build: sourceBuild,
        // 输出配置 
        output: {
            // 输出的根目录
            root: sourceBuild,
            // 输出的样式目录
            css: sourceBuild+'/css',
            images: sourcePath+'/images'
        },
        watcher : {
            rootRule: [sourcePath+'/**'],
            scssRule: [sourcePath+'/**/*.scss','!'+sourcePath+'/scss/**/*.scss'],
            jsRule: [sourcePath+'/**/*.js','!'+sourcePath+'/**/*.min.js','!'+sourcePath+'/js/**/*.js'],
            htmlRule: [sourcePath+'/**/*.html'],
        }
}

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
    // 缓存
    cache = require('gulp-cache'),
    // CSS编译
    sass = require('gulp-sass'),
    // 脚本压缩
    uglify = require('gulp-uglify'),
    // 静态服务器
    connect = require('gulp-connect'),
    // 跨域代理
    proxy = require('http-proxy-middleware'),
    // ES6 转ES5
    babel = require('gulp-babel');

// 启动服务并且允许处理接口跨域
gulp.task('server', function() {
    connect.server({
        root: config.server.root,
        port: config.server.port,
        livereload: isLivereload,
        middleware: function(connect, opt) {
            // 请求代理, 多个不同地址接口在package.proxy 里面新增多个

            let proxys = [];
            if( "proxy" in package){
                let proxyObj = package["proxy"];
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
  gulp.src(config.watcher.scssRule)
    .pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(config.output.root));
// 编译style.scss文件
  gulp.src(config.source.scss)
    // 生成css对应的sourcemap 
    // .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.output.css))
    // 输出多一份编译的在源码里
    .pipe(gulp.dest(config.source.css))

})

// 脚本 编译
gulp.task('scripts',function () {
    gulp.src(config.watcher.jsRule)
        // error end task
        .pipe(plumber({
            errorHandler : function (error) {
                this.emit('end');
            }
        }))
        // translate es5
        .pipe(babel({
            presets: ['es2015']
        }))
        // compress script
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest(config.output.root));
});

// move all file except pages/js/** .sass .md 
gulp.task('move',function () {
    gulp.src([config.source.root+'/**','!**/*.{md,png,jpg,gif,ico}','!'+config.source.root+'/'+sourceModules+'/**/*.js','!'+config.source.root+'/index.js','!'+config.source.root+'/scss','!'+config.source.root+'/**/*.scss','!**/package.json','!**/gulpfile.js'])
        .pipe(gulp.dest(config.output.root));

});

// compress html
gulp.task('html', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: false,
        collapseBooleanAttributes: false,
        removeEmptyAttributes: false,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src(config.watcher.htmlRule)
        .pipe(plumber())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(config.output.root));
});

// compress image
gulp.task('images', function () {
    gulp.src(config.source.images)
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest(config.output.images));
});


// 实时监听 scss, html, js 等的修改
gulp.task('watch', function() {
    // 使用自动刷新会导致BUI调试时,页面无法后退,所以这里默认是关闭的
    isLivereload && livereload.listen();
    // 监听scss变化
    gulp.watch(config.watcher.scssRule,['scss']);
    gulp.watch(config.source.scss,['scss']);
    // 监听脚本变化
    gulp.watch(config.watcher.jsRule,['scripts']);
    // 监听html变化
    gulp.watch(config.watcher.htmlRule,['html']);
    // 改变的时候刷新更改
    isLivereload && gulp.watch(config.watcher.rootRule).on('change', livereload.changed);
    !isLivereload && gulp.watch(config.watcher.rootRule).on('change', function (e) {
        console.log(e.path+' '+e.type);
    });

})


// 编译任务以后,缺省任务的服务才能跑起来
gulp.task('build', ['move','images','html','scss','scripts']);

// 注册缺省任务,启动服务,并且监听文件修改并且编译过去
gulp.task('default', ['server','watch']);
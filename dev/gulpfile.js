// 获取默认配置
var package = require("./package.json"),
    
    devServer = package.devServer && package.devServer || {},

    // 服务器根目录
    serverRoot = devServer.root || 'dist',
    // 服务器端口
    serverPort = devServer.port || 8000 ,
    // 源文件目录
    sourcePath = devServer.source || 'src',
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
            css: sourcePath+'/css/**',
            // 源文件字体目录
            font: sourcePath+"/font/*.{eot,svg,ttf,woff}",
            // scss源文件目录
            scss: sourcePath+'/scss/style.scss',
            // 源文件脚本目录
            script: sourcePath+'/js/**',
            // 源文件图片目录
            images: sourcePath+'/**/*.{png,jpg,gif,ico}',
        },
        // 输出配置 
        output: {
            // 输出的根目录
            root: serverRoot,
            // 输出的样式目录
            css: serverRoot+'/css',
            // 输出的字体目录
            font: serverRoot+'/font',
            // 输出的脚本目录
            script: serverRoot+'/js',
        },
        watcher : {
            rootRule: [sourcePath+'/**'],
            scssRule: [sourcePath+'/**/*.scss','!'+sourcePath+'/scss/*.scss'],
            jsRule: [sourcePath+'/**/*.{js,json}','!'+sourcePath+'/**/*.min.js','!'+sourcePath+'/js/**/*.js','!/**/gulpfile.js','!/**/package.json'],
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
        livereload: false,
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
            // return [
            //     proxy(config.api.path ,  {
            //         target: config.api.host ,
            //         changeOrigin:true,
            //         secure: false,
            //     })
            // ]
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
// move file 
gulp.task('move',function () {
    // move bui.css
    gulp.src(config.source.css)
        .pipe(gulp.dest(config.output.css));
    // move bui.js
    gulp.src(config.source.script)
        .pipe(gulp.dest(config.output.script));
    // move bui font
    gulp.src(config.source.font)
        .pipe(gulp.dest(config.output.font));
});

// compress html
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: false,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
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
        .pipe(gulp.dest(config.output.root));
});


// 实时监听 scss, html, js 等的修改
var watcher = gulp.task('watch', function() {
    // 使用自动刷新会导致BUI调试时,页面无法后退,所以这里默认是关闭的
    // livereload.listen();
    // 监听scss变化
    gulp.watch(config.watcher.scssRule,['scss']);
    // 监听脚本变化
    gulp.watch(config.watcher.jsRule,['scripts']);
    // 监听html变化
    gulp.watch(config.watcher.htmlRule,['html']);
    // 改变的时候刷新更改
    // gulp.watch(config.watcher.rootRule).on('change', livereload.changed);

})

// 监听改变输出
watcher.on('change', function(event) {
    console.log(event.path + event.type );
});

// 编译任务以后,缺省任务的服务才能跑起来
gulp.task('build', ['move','html','scss','scripts','images' ]);

// 注册缺省任务,启动服务,并且监听文件修改并且编译过去
gulp.task('default', ['server','watch' ]);
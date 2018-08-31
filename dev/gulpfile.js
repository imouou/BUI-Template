
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
    sass = require('gulp-sass'),
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
    // 用于获取本机信息
    // os=require('os');

// 同步刷新
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// 获取默认配置
var configName = "app.json",
    app = require("./"+configName),
    // 编译服务配置
    distServer = app.distServer || {},
    // 开发服务配置
    devServer = app.devServer || {},
    // 实时刷新,仅在开发模式
    isDevLivereload = devServer.livereload == false ? false : true,
    // 实时刷新,仅在编译模式
    isDistLivereload = distServer.livereload == false ? false : true,
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
            scssRule: [sourcePath+'/**/*.scss','!'+sourcePath+'/scss/**/_*.scss'],
            jsRule: [sourcePath+'/**/*.js','!'+sourcePath+'/js/bui.js','!'+sourcePath+'/js/zepto.js','!'+sourcePath+'/js/platform/**/*.js','!'+sourcePath+'/js/plugins/**/*.js','!'+sourcePath+'/**/*.min.js'],
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
    let random = Math.random()*10000+1000;
    let randomPort = parseInt(random);

    return randomPort;
}

// 获取端口并写入配置
function getServerPort() {

    // 开发版运行端口
    let devPort = getRandomPort();
    // 编译版运行端口
    let distPort = devPort+2;
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


// 清空文件,在最后构建的时候才加入这部
gulp.task('clean-dist', cb => {
   return del([sourceBuild+'/**/*'], cb);
});

// sass 实时编译, 并生成sourcemap 便于调试
gulp.task('scss', function() {

    return gulp.src(sourcePath+"/scss/*.scss")
        .pipe(changed(sourceBuild+'/css/'))
        // 生成css对应的sourcemap 
        .pipe(sourcemaps.init())
        .pipe(sass(app.sass).on('error', sass.logError))
        .pipe(autoprefixer(app.autoprefixer))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sourceBuild+"/css"))
        .pipe(reload({stream: true}));
});

// sass 编译
gulp.task('css', function() {
// 编译style.scss文件
  return gulp.src(sourcePath+"/css/**/*.css")
    .pipe(changed(sourceBuild+'/css/'))
    .pipe(gulp.dest(config.output.css))
    .pipe(md5(10, sourceBuild+"/**/*.html"))
    .pipe(reload({stream: true}));
})

gulp.task('css-minify', function() {
// 编译style.scss文件
  return gulp.src(sourcePath+"/css/**/*.css")
    .pipe(changed(sourceBuild+'/css/'))
    .pipe(minifycss(app.cleanCss))
    .pipe(gulp.dest(config.output.css))
    // .pipe(md5(10, sourceBuild+"/**/*.html"))
    // .pipe(reload({stream: true}));
})

// 处理完JS文件后返回流
gulp.task('js-babel', function () {
    
    return gulp.src(config.watcher.jsRule)
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
        // .pipe(uglify(app.uglify))
        .pipe(gulp.dest(config.output.root))
        .pipe(reload({stream: true}))
        .pipe(md5(10, sourceBuild+'/**/*.html'));
});
// 脚本 编译
gulp.task('js-minify',function () {
    return gulp.src(config.watcher.jsRule)
        // .pipe(changed(config.output.root))
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
        .pipe(gulp.dest(config.output.root))
        .pipe(md5(10, sourceBuild+'/**/*.html'));
});


// 把bui需要的文件移动过去
gulp.task('move-bui', function () {
    
    gulp.src([sourcePath+'/css/bui.css'])
        .pipe(gulp.dest(sourceBuild+'/css/'))
    gulp.src([sourcePath+'/js/bui.js'])
        .pipe(gulp.dest(sourceBuild+'/js/'))
    gulp.src([sourcePath+'/js/platform/*.js'])
        .pipe(gulp.dest(sourceBuild+'/js/platform/'))
});
// move all file except pages/js/** .sass .md 
gulp.task('move',function () {
    return gulp.src([config.source.root+'/**','!**/*.{html,css,scss,less,md,png,jpg,gif,ico}','!'+config.source.root+'/scss'])
        .pipe(changed(config.watcher.rootRule))
        .pipe(gulp.dest(config.output.root));
});

// compress html
gulp.task('html', function () {
    var options = app.htmlmin;
    return gulp.src(config.watcher.htmlRule)
        .pipe(changed(sourceBuild))
        .pipe(plumber())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(sourceBuild))
        .pipe(md5(10))
        .pipe(reload({stream: true}))
});

// compress image
gulp.task('images',function () {
    return gulp.src(config.source.images)
        .pipe(changed(config.output.images))
        .pipe(imagemin(app.imagemin))
        .pipe(gulp.dest(config.output.images));
});


// 同步服务
gulp.task('server-sync', ['server-build'], function() {
    var portObj = getServerPort();


    let proxys = [];
    if( "proxy" in app){
        let proxyObj = app["proxy"];
        let keys = Object.keys(proxyObj);

        keys.forEach(function (item,i) {
            let proxyItem = proxy(item , proxyObj[item])
            proxys.push(proxyItem);
        })
    }

    // 起一个同步服务
    browserSync.init({
        ui: {
            port: portObj.distPort+1
        },
        server: {
            baseDir: app.distServer.root,
            middleware: proxys
        },
        port:portObj.distPort,
        ghostMode: false,
        notify: false,
        codeSync: isDistLivereload,
        // 同步开启多个窗口同步
        // ghostMode: {
        //         clicks: false,
        //         forms: false,
        //         scroll: false
        //     }
        // logLevel: "info",
        // reloadDebounce: 0,
        // injectChanges: true,// css 注入修改
        // timestamps: true
        // plugins: [
        //     {
        //         module: "bs-html-injector",
        //         options: {
        //             files: [sourcePath+"/**/*.html"]
        //         }
        //     }
        // ] 
    });

    // 新增删除由插件负责
    watch(config.watcher.rootRule)
        .on('add', addFile)
        .on('change', changeFile)
        .on('unlink', function(file){
            //删除文件
            let distFile = './'+sourceBuild+'/' + path.relative('./'+sourcePath, file); //计算相对路径
            fs.existsSync(distFile) && fs.unlink(distFile);
            console.warn(file,"deleted")
        });
    
    // 监听文件修改
    gulp.watch(sourcePath+"/scss/**/*.scss", ['scss']);
    gulp.watch(sourcePath+"/css/**/*.css", ['css']);
    gulp.watch([sourcePath+"/**/*.js"],['js-babel']);
    gulp.watch([sourcePath+"/**/*.html"],['html']);

});

// 起一个src目录的server
gulp.task('server', function() {
    var portObj = getServerPort();

    let proxys = [];
    if( "proxy" in app){
        let proxyObj = app["proxy"];
        let keys = Object.keys(proxyObj);

        keys.forEach(function (item,i) {
            let proxyItem = proxy(item , proxyObj[item])
            proxys.push(proxyItem);
        })
    }

    // 起一个同步服务
    browserSync.init({
        ui: {
            port: portObj.devPort+1
        },
        server: {
            baseDir: app.devServer.root,
            middleware: proxys
        },
        port:portObj.devPort,
        ghostMode: false,
        codeSync: isDevLivereload
    });

});

// 监测新增
function addFile(file){
    console.log(file,"added");
    gulp.src(file, {base : './'+sourcePath}) //指定这个文件
        .pipe(gulp.dest('./'+sourceBuild))

}
// 监测新增

function changeFile(file){
    console.info(file,"changed");

    gulp.src(file, {base : './'+sourcePath}) //指定这个文件
        .pipe(gulp.dest('./'+sourceBuild))

}


// 编译任务以后,缺省任务的服务才能跑起来
gulp.task('build', sequence('clean-dist','move','move-bui',['html'],['images','scss'],['css-minify'],['js-minify']  ) );

// 先编译再起服务,不需要每次都清除文件夹的内容
gulp.task('server-build', sequence('move','move-bui',['html'],['images','scss'],['css'],['js-babel'] ) );

// 注册缺省任务,启动服务,并且监听文件修改并且编译过去
gulp.task('dev', ['server-sync']);

gulp.task('default', ['dev']);
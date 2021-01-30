let {src,pipe,dest,series,parallel,watch  } = require('gulp');
let del = require('del'); // 删除文件夹和文件
let sass = require('gulp-sass'); // 编译css
let cssmin = require('gulp-cssmin'); // 压缩
let rename = require('gulp-rename'); // 重命名
const autoprefixer = require('gulp-autoprefixer'); // 添加浏览器厂商前缀（can i use）
var concat = require('gulp-concat'); // 合并js或css
var uglify = require('gulp-uglify'); // 压缩js
var babel = require('gulp-babel'); // es6转为es5
const htmlmin = require('gulp-htmlmin'); // html压缩
var browserSync = require('browser-sync'); // 可以一个服务器，实现页面热更新

function clean(){
    // 清除构建目录dist
    return del(['./dist/']);
}

// 把src/index.html复制到dist/index.html
function html(){
    return  src('./src/index.html')
            // 压缩html
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest('./dist'))
}

// 合并css或js
function js(){
    return src('./src/js/*.js')
            .pipe(concat('all.js'))
            .pipe(babel(
                {
                    presets: ['@babel/preset-env']
                }
            ))
            .pipe( uglify())
            .pipe(dest('./dist/js/'))
            .pipe(browserSync.stream()) // 实时把结果同步给浏览器
}

//任务：把scss编译成css
function  css(){
    return src('./src/scss/*.scss') // 源目录
            .pipe(sass()) // 下一步编译 先编译
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
              }))
            .pipe(cssmin()) // 在压缩
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(dest('./dist/css/')) // 最后输送到目标目录
            .pipe(browserSync.stream()) // 实时把结果同步给浏览器
}


// 监听scss和js文件的改变，自动触发js和css任务
function watchTask(){
    // 启动一个服务器，
    browserSync.init({
        // 指定一个网站根目录
        server:"./dist"
    })
    // 并监听文件的改变自动执行相应的任务
    watch('./src/scss/*.scss',css); // 热加载
    watch('./src/js/*.js',js); // 热加载
    watch('./src/index.html',html).on('change',browserSync.reload) // 页面刷新
}

exports.jsTask = js
exports.cleanTask= clean;
exports.watchTask= watchTask;

// 构建任务之前需要删除原来的构建目录
// 需要同步任务： 1.删除 2.构建任务
// exports.CssTask = css
// exports.build = series(clean,css);

// 开发阶段一般都是在一个服务器下开发的，可以实现页面的热更新  gulp serve 
exports.serve = parallel(html,css,js,watchTask)


// 部署阶段，是不需要启动服务器，只需要把构建好的文件部署到线上服务器即可 gulp build

//先删除dist目录，完毕之后，在并行(js)执行任务js和css 
exports.build = series(clean, parallel(html,js,css))



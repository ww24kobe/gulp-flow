# Gulp前端自动化构建工具

## 什么是Gulp,为什么使用Gulp

[Gulp](https://www.gulpjs.com.cn/)是基于Node.js 实现web前端自动化构建的工具，它可以自动化高效的构建我们工作中的一些任务,

在 Web 前端开发工作中有很多“重复工作”，比如压缩CSS/JS文件、es6编译成es5，而这些工作都是有规律的。找到这些规律，并编写 gulp 配置代码,让 gulp 自动执行这些“重复工作”。


常用的前端构建工具还有: [grunt](https://gruntjs.com/)、[webpack](https://www.webpackjs.com/)等.


## Gulp入门指南



> 注意：`gulp3`版本在node12上已经是被放弃的版本了。既然如此那就升级`gulp4`吧





1. 安装最新版本的gulp：  

```
npm init -y
npm install gulp-cli -g
npm install gulp -D
```

2. 在项目根目录下创建一个名为 `gulpfile.js` 的配置文件
```js
// gulp3写法
var gulp = require('gulp'); 
gulp.task('default', function() { 
    // 将你的默认的任务代码放在这
    console.log('执行任务')
   
});
```

```
// gulp4写法
const { src, dest } = require('gulp');

function defaulTask(cb) {
    // 将你的默认的任务代码放在这
    console.log('执行任务')
    cb() //cb()用来终止任务
}

exports.default = defaulTask;
```

> gulp4是通过exports的方式创建任务。 
语法：

```
exports.任务名 = 函数名
```


执行任务:

```js
gulp <task> 
```

 task为任务名, task不写默认为default



# Gulp中的src()、dest()、pipe()方法



gulp充分使用了**管道**思想，就是一个数据流（stream）


- src()：读入文件产生数据流， [Gulp .src() 路径匹配模式](https://blog.csdn.net/wildye/article/details/80516847#%E8%AF%AD%E6%B3%95gulpsrcglobs-options)
- pipe(): 管道方法。可以理解为一根水管，表示对内存中的数据流进行下一步操作。
- dest():  将数据流写入目标文件。

以上三个方法都是按照以下顺序：

> src(原路径)->pipe(任务1)->->pipe(任务2)-->pipe(任务3)-->pipe(任务4)->pipe(dest(目标路径))



正因为gulp帮我们封装好了流，因此，我们可以直接使用pipe这个api来传输数据。

![1597458920878.png](https://note.youdao.com/yws/res/274/WEBRESOURCE7d9a4adb4214b18bc68fc963f9668564)


gulp4比gulp3版本多出以下两个函数：
- `series(...tasks)` ： 串行执行多个任务
- `parallel(...tasks)`： 并行执行多个任务

## 例1：将src目录下的index.html文件复制到dist目录中 

```javascript
// gulp3写法
const gulp = require('gulp')
gulp.task("copyHtml",function(){
    return gulp.src('src/index.html')
    		  .pipe( gulp.dest('dist') )
})
```

```javascript
// gulp4写法
const { parallel,series,src,pipe,dest,watch } = require('gulp');
function copyHtml(){
    return src('src/index.html')
    		  .pipe( dest('dist') )
}

exports.copyHtml = copyHtml
```

在根目录执行任务：
```js
gulp copyHtml
```
gulp4语法：`exports.任务名 = 函数名`

## 例2：将src目录下的所有的后缀为`.js`文件复制到dist目录中的子目录js中 

```javascript
function copyJs(){
    return src('lib/*.js')
    		  .pipe( dest('dist/js') )
})

exports.copyJsTask = copyJs;
```


> 注意 * 和 ** 的区别

`js/*.js`：匹配js目录下所有后缀名为`js`的文件

`js/**/*.js`：匹配js目录及子孙目录中的所有后缀名为`js`的文件 

[Api参考文档](https://v3.gulpjs.com.cn/docs/api/)


 ## src常用匹配模式

语法：`src(globs,	[options])`

- `globs`：文件匹配模式(类似正则表达式)，用来匹配文件路径(包括文件名)
- `options`：为可选参数。一般用不到

Gulp 内部使用了 node-glob 模块来实现其文件匹配功能

```js
// 单匹配模式
src('[abc].js') // 匹配 a.js， b.js， c.js
src('[^abc].js') // 匹配 x.js， y.js

// 排除模式：匹配所有js文件，但排除掉以b开头的js文件。 符号"!"为排除操作
src(['*.js'','!b.js']) 

// 数组匹配模式：匹配js目录中所有js文件，匹配css目录中所有css文件，匹配所有的html
src(['js/*.js', 'css/*.css', '*.html']) 

// 获取所有后缀名为js的文件，排除node_modules目录
src(['**/*.js', '!node_modules/'])
```

[Glob详解](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/)



# Gulp中的watch方法

作用：监听文件的改变,并执行相应的任务

 
 如：监听src目录下的index.html文件，如果该文件有改动，自动执行copyHtml任务

```javascript
const { parallel,series,src,pipe,dest,watch } = require('gulp');

function copyHtml(){
    return src('src/index.html')
    		  .pipe( dest('dist') )
}

function watchHtml(){
    watch('./src/index.html', ['copyHtml'])
}

exports.watchHtmlTask = watchHtml
```

# Gulp插件的使用

我们将要使用Gulp插件来完成我们以下任务：

- sass的编译（[gulp-sass](https://github.com/dlmanning/gulp-sass)）
- less编译（gulp-less）
- 压缩css（[gulp-cssmin](https://github.com/pdehaan/gulp-cssmin)）或 [gulp-csso](https://www.npmjs.com/package/gulp-csso)
- 压缩js代码（[gulp-uglify](https://github.com/terinjokes/gulp-uglify)）
- 重命名（[gulp-rename](https://github.com/hparra/gulp-rename)]）
- es6转es5 ([gulp-babel](https://github.com/babel/gulp-babel))
- 自动添加css前缀（[gulp-autoprefixer](
  https://www.npmjs.com/package/gulp-autoprefixer)）
- 合并js、css文件（[gulp-concat](https://github.com/wearefractal/gulp-concat)）
- 自动刷新页面（[browser-sync](http://www.browsersync.cn/docs/api/)）实现页面热更新
- ...

更多gulp插件[参考](https://gulpjs.com/plugins/)




## 示例1：借助gulp-sass插件编译scss
需要安装`gulp-sass`插件
```javascript
let {src,pipe,dest} = require('gulp')
let sass = require('gulp-sass');

function complieScss() {
	return src('./src/css/index.scss')
		.pipe(sass())
		.pipe(dest('./dist/css'))
}
exports.complieScssTask = complieScss
```


## 示例2：借助gulp-cssmin插件压缩css
需要安装`gulp-cssmin`插件
```javascript
var cssmin = require('gulp-cssmin');

//压缩css代码
function compressCss(){
 return src('./src/style.css')
      .pipe( cssmin() )
      .pipe( dest('./dist') )
}
exports.compreCssTask = compressCss
```

## 示例3：执行多个操作
同时实现以下任务：
- 编译scss
- 添加css私有前缀
- 压缩
- 重命名
需要安装`gulp-rename`重命名插件
```javascript
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer'); // 添加浏览器厂商前缀（can i use）

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
}

exports.cssTask = css;
```

[browserslist 目标浏览器配置表](
https://www.jianshu.com/p/bd9cb7861b85)
[参数详解](
https://github.com/browserslist/browserslist#queries)

## 示例4：es6转es5
需要借助babel转换,安装命令：
```
npm install --save-dev gulp-babel @babel/core @babel/preset-env
```
参考文档：[https://github.com/babel/gulp-babel](https://github.com/babel/gulp-babel)
需要安装`gulp-babel`插件
```javascript
const babel = require('gulp-babel');

gulp.task('es6', () =>
	gulp.src('src/app.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest('dist'))
);
```


## 示例5 合并转换压缩js

```
var concat = require('gulp-concat'); // 合并js或css
var uglify = require('gulp-uglify'); // 压缩js
var babel = require('gulp-babel'); // es6转为es5
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
}

exports.jsTask = js
```

## 实现浏览器自动刷新和（热更新）
需要安装`browser-sync`插件 , 核心是在最后的操作，把最终处理的流数据同步给浏览器


参考代码：
```javascript
var browserSync = require('browser-sync'); 
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
            .pipe(browserSync.stream()) // 实时把结果同步给浏览器，实现热更新
}
```
在启动一个服务器，并实时监听文件的变化
- css/js改变触发热更新
- html改变刷新浏览器
```
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
```

参考文档:
- [Browsersync](http://www.browsersync.cn/docs/api/)


# gulp4 构建项目自动化工作流

目标： 

- 实现将scss->css->合并css->压缩->重命名->dist/css
- 将es6->es5->dist/js
- `*.html`压缩后复制到dist/`*.html`
- 启动服务器，自动打开浏览器，监听上面文件的变化实现热加载。


- 源代码目录：src
- 构建后的目录：dist


配置文件gulpfile.js参考代码：
```
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



```

开发时，启动任务：

```js
gulp serve
```

开发完毕进行构建：
```
gulp build
```
配置好后就可以愉快的使用gulp进行项目开发了
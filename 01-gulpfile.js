let {src,dest,series,parallel} = require('gulp')



// 定义一个default任务
function defaultTask(cb){
    console.log('压缩任务')
    // console.log(cb.toString())
    cb(); // 终止函数 exit();
}

//定义css任务
function cssHandle(cb){
   
    for(let i=0; i<100000; i++){
        
    }
    console.log('css任务')
    cb();
}

//定义js任务
function jsHandle(cb){
    console.log('js任务')
    cb();
}


//series() ： 串行执行多个任务
//parallel()： 并行执行多个任务

// exports.任务名 = 函数名
// exports.default = defaultTask

exports.css = cssHandle;

// 同步（串行）：先执行default->css->js任务
// exports.default = series(defaultTask,cssHandle,jsHandle)


// 并行（一起执行）多个任务
exports.default = parallel(defaultTask,cssHandle,jsHandle)
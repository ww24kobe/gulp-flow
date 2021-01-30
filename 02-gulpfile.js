let {src,pipe,dest} = require('gulp');


// 基本流程(内存数据流的走向)： src()->pipe->pipe->pipe->pipe->pipe->pipe(dest())
//定义任务把src目录下面的index.html复制到dist目录中
function copyHtmlCb(){
    return src('./src/*')
            .pipe( dest('./dist')  )
}

exports.copyHtml = copyHtmlCb;
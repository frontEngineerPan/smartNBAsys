var Crawler = require("crawler");
//crawler可以将文档格式化为jQuery Dom的形式
var c = new Crawler({
    // 在每个请求处理完毕后将调用此回调函数
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ 默认为 Cheerio 解析器
            // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
            console.log($("article").text());
        }
        done();
    }
});
c.queue('https://www.sohu.com/a/279744810_458722');

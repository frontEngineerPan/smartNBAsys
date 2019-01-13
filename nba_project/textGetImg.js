const Crawler = require("crawler");
const go=require(0);
var fs = require("fs");//这是nodejs内置的
var c = new Crawler({
    encoding:null,
    jQuery:false,// set false to suppress warning message.
    callback:function(err, res, done){
        if(err){
            console.error(err.stack);
        }else{//写入本地文件
            fs.createWriteStream(res.options.filename).write(res.body);
        }

        done();
    }
});
c.queue({
    uri:"http://i4.hexunimg.cn/2016-10-11/186368488.jpg",
    filename:"baidu.jpg"
});
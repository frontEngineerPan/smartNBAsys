//该模块用于抽取单页符合要求的url
var Crawler = require("crawler");
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{	
			//到这里我们已经获取全部document
		    list=[];
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
			var addList=function(){
					$("a[test='a']").each(function(key,value){
						if(($(this).attr("href").indexOf("picture")==-1)&&($(this).attr("href").indexOf("sports")==-1)&&($(this).attr("href").lastIndexOf("http")==0)){
						list.push($(this).attr("href"));
						}
				});
			};
			addList();
			console.log(list);
        }
        done();
    }
});
c.queue('http://sports.sohu.com/nba_a.shtml');
for(let i=2219;i>=2121;i--){
	var url_tmp='http://sports.sohu.com/nba_a_'+i+'.shtml';
	c.queue(url_tmp);
}


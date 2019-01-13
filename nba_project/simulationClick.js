var Nightmare = require('nightmare');
//引入浏览器自动化库,特点是回调式，过程化
var nightmare = Nightmare({
    show: false,
	//是否调用可视化窗口
    pollInterval: 1000,
	//限定时间间隔,每一次轮询判定若超时就会判定为异常
}); 
nightmare
    .goto('http://roll.news.qq.com/')
	//轮询判定：列表是否存在内容
    .wait(function() {
        return document.querySelectorAll("#artContainer li").length>0;
    })
	//轮询判定
    .wait(function() {
	//轮询判定	
        if (window._$qqNews == undefined) {
			//_$qqNews.items是最终要返回的数据内容
            window._$qqNews = {
                total: 0,
                page: 0,
                items: []
            }
            //页面自动刷新
            AutoRefresh();
			//取得分页标签数目的值
            _$qqNews.total = qq.$("totalPage").value;
			//G是自定义的全局对象
			//showArtList():返回文章列表
            G.c = function(responseText) {		
                try {
					//eval(javascript代码)自动执行js代码 
					//定义json是后台返回的数据
                    eval("var json = " + responseText);
                    if (json.response.code == "0") {
						//加载article内容
                        qq.$("artContainer").innerHTML = json.data.article_info;
						//newslist：所有在article内的a标签组
                        var newslist = document.querySelectorAll("#artContainer li a");
						//构造要返回的内容
                        for (var i = 0; i < newslist.length; i++) {
                            _$qqNews.items.push({
                                title: newslist[i].childNodes[0].data,
                                href: newslist[i].href
                            });
                        }
						//更新页面中分页标签的当前值
                        qq.$("totalPage").value = json.data.count;
						//如果尚存未被遍历的页面，跳转下一页并减少该数目1
                        if (_$qqNews.total > 1) {
                            _$qqNews.total -= 1;
							//下一页
                            nextPage();
                        }
						//规约异常情况的处理机制
                    } else if (json.response.code == "2") {
                        qq.$("totalPage").value = 1;
                        G.gotoPage(1);
                        qq.$("artContainer").innerHTML = '<div class="article-tips">该日期没有文章！</div>';
                    } else {
                        qq.$("totalPage").value = 1;
                        G.gotoPage(1);
                        qq.$("artContainer").innerHTML = '<div class="article-tips">文章加载失败！</div>';
                    }
                } catch (e) {}
            }
            //加载第1页
            Refresh();
            return false;
        }
		//只有页面数目全部被遍历才返回1
        if (_$qqNews.total == 1)
            return true;
        return false;
    }).evaluate(function() {
        return _$qqNews.items;
    })
    .end()
    .then(function(result) {
        console.log(result, result.length)
    }).catch(function(error) {
        console.log('错误是：' + error);
    })
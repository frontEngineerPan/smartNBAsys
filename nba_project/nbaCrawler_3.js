var Nightmare = require('nightmare');
var nightmare = Nightmare({
    show: true,
	//是否调用可视化窗口//程序是否可视化
    pollInterval: 1000,
	//限定时间间隔,每一次轮询判定若超时就会判定为异常
}); 
nightmare
    .goto('http://sports.sohu.com/1/1102/39/subject204253982.shtml').
	//判定轮询:要求遍历所有的页面
	.wait(function( ){//该函数返回值为真才会通过轮询
		if (window._$nbaNews == undefined) {
			window._$nbaNews = {//用该对象保存需要的信息
				total: 0,//总的页数
				page: 0,//当前页
				items: []//链接
			}
			_$qqNews.total = 100;
		}
	}).


list.init();
G.paraElement = {site : "",	cata : "", mod : "", date:"", page:"1", of : "json" } //mod 是文章显示模式，1为标题模式；2为摘要模式
G.siteList = [["news", "新闻", "http://news.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/news_logo.png"],
			  ["ent", "娱乐", "http://ent.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/ent_logo.png"],
			  ["finance", "财经", "http://finance.qq.com", "http://mat1.gtimg.com/finance/financeNav0531/logo.png"],
			  ["sports", "体育", "http://sports.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/sports_logo.png"],
			  ["auto", "汽车", "http://auto.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/auto_logo.png"],
			  ["tech", "科技", "http://tech.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/tech_logo.png"],
			  ["lady", "女性", "http://lady.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/lady_logo.png"],
			  ["luxury", "时尚", "http://luxury.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/luxury_logo.png"],
			  ["book", "读书", "http://book.qq.com", "http://mat1.gtimg.com/book/2009images/index09/book_logo.png"],
			  ["games", "游戏", "http://games.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/games_logo.png"],
			  ["edu", "教育", "http://edu.qq.com", "http://mat1.gtimg.com/www/images/channel_logo/edu_logo.png"],
			  ["house", "房产", "http://house.qq.com/", "http://mat1.gtimg.com/www/images/channel_logo/house_logo.png"],
			  ["ru", "儒学", "http://ru.qq.com/", "http://mat1.gtimg.com/rushidao/ru2013/logo_ru.jpg"],
			  ["foxue", "佛学", "http://foxue.qq.com/", "http://mat1.gtimg.com/rushidao/fo2013/logo_fo.jpg"],
			  ["dao", "道学", "http://dao.qq.com/", "http://mat1.gtimg.com/rushidao/dao2013/logo_dao.jpg"]]; //TODO:在这里添加更多频道名称对应表
G.allCataList = [];
G.paraElement.site = getSiteFromUrl();
G.paraElement.cata = ValidateCheck(G.getParameter("cata"))?(G.getParameter("cata")):""; 
G.paraElement.date = dateValidate(G.getParameter("date"))?(G.getParameter("date")):""; 
G.paraElement.page = "1";
window.onload = function(){	
	for(var i=0; i<G.siteList.length; i++){
		if(G.siteList[i][0] == G.paraElement.site){ 
			qq.$("nav").innerHTML = "腾讯" + G.siteList[i][1];
			qq.$("nav").href = G.siteList[i][2];
			qq.$("sitelogo").src = G.siteList[i][3];
			qq.$("sitelogo").title = "腾讯" + G.siteList[i][1];
			if ("ru" == G.siteList[i][0] || "foxue" ==  G.siteList[i][0] || "dao" == G.siteList[i][0])
			{
			//	qq.$("rolltop").src = "http://" + G.siteList[i][0] + ".qq.com/c/rolltop_" + G.siteList[i][0] + ".htm";
			}
			else
				qq.$("rolltop").src = "http://" + G.siteList[i][0] + ".qq.com/c/rolltop.htm";
		}
	}
	G.requestCataList();
	var mod = baseTools.getCookie("roll_mod");
	mod = mod ? mod : "1"; 
	ChangeMod( mod );
}

function Refresh(){
	G.refreshData();
}
	
if(G.paraElement.site == 'news'){
	TopAd();
}
//通栏广告
function TopAd(){
	qq.$('News_2nd_GD_Width1').style.display='block';
	
	var oldS=document.getElementById('l_qq_com');
    if(oldS) oldS.parentNode.removeChild(oldS);
	var scritpEl = document.createElement('script');
	scritpEl.id = "l_qq_com";
	scritpEl.type = "text/javascript";
	scritpEl.setAttribute("arguments","{'extension_js_src':'http://adsrich.qq.com/web/crystal/v1.9Beta03Build031/crystal_ext-min.js','lview_time_out':10,'mo_page_ratio':0.02,'mo_ping_ratio':0.01,'mo_ping_script':'http://adsrich.qq.com/sc/mo_ping-min.js'}");
	scritpEl.src="http://adsrich.qq.com/web/crystal/v1.9Beta03Build031/crystal-min.js";
	
	document.getElementsByTagName('head')[0].appendChild(scritpEl);
}
//切换文章显示模式
function ChangeMod( mod ){
	if(G.paraElement.mod == mod) return;
	G.paraElement.page = "1";
	if(mod=="1"){
		qq.$("change2title_top").className = "cur";
		qq.$("change2title_bottom").className = "cur";
		qq.$("change2abs_top").className = "";
		qq.$("change2abs_bottom").className = "";

		qq.$("abs_tips").innerHTML = "标题模式将自动开启60秒刷新";
		qq.$("abs_tips").style.display = "block";
		setTimeout('qq.$("abs_tips").style.display = "none"',5000);

		if(qq.$("auto_refresh").parentNode.className == "check") AutoRefresh();
	}
	else{
		qq.$("abs_tips").innerHTML = "摘要模式将自动关闭60秒刷新";
		qq.$("abs_tips").style.display = "block";
		setTimeout('qq.$("abs_tips").style.display = "none"',5000);
		if(qq.$("auto_refresh").parentNode.className == "check checked") AutoRefresh();
		qq.$("change2title_top").className = "";
		qq.$("change2title_bottom").className = "";
		qq.$("change2abs_top").className = "cur";
		qq.$("change2abs_bottom").className = "cur";
	}
	G.paraElement.mod = mod;
	baseTools.setCookie("roll_mod", mod);
	G.refreshData();
}

//频道跳转
function ChangeSite( site ){
	if(G.paraElement.site == site) return;
	window.location = "http://roll." + site + ".qq.com";
}

//选择栏目
function ChangeCata( num ){
	G.paraElement.page = "1";
	G.allCataList[num].checked = (G.allCataList[num].checked=="0")?"1":"0";
	qq.$("catacheck_"+num).className = (G.allCataList[num].checked=="0")?"check":"check checked";
	qq.$("catacheck_all").className = "check";
	G.paraElement.cata = "";
	var catalist = [];
	for(var i=0; i<G.allCataList.length; i++){
		if(G.allCataList[i].checked == "1"){
			catalist.push(G.allCataList[i].ename);
		}
	}
	if(catalist.length>0) G.paraElement.cata = catalist.join(",");
	
	G.refreshData();
}

//选择全部栏目
function ChangeCataAll(){
	G.paraElement.page = "1";
	if(qq.$("catacheck_all").className == "check checked") return;
	qq.$("catacheck_all").className = "check checked";
	for( var i=0; i<G.allCataList.length; i++){
		G.allCataList[i].checked = "0";
		qq.$("catacheck_"+i).className = "check";
	}
	G.paraElement.cata = "";
	G.refreshData();
}

//页面自动刷新
var countingDown = 0;
function AutoRefresh(){
	if(qq.$("auto_refresh").parentNode.className == "check checked"){
		qq.$("auto_refresh").parentNode.className = "check";
		clearInterval(countingDown);
		qq.$("auto_refresh").innerHTML = 60;
	}
	else{
		qq.$("auto_refresh").parentNode.className = "check checked"
		var count = 60
		countingDown = setInterval(function() {
			qq.$("auto_refresh").innerHTML = --count;
			if (count <= 0) {
				G.refreshData();
				count = 60;
			}
		},
		1000);		
	}
}

//翻页
function prevPage(){
	G.paraElement.page = parseInt(G.paraElement.page)>1 ? (parseInt(G.paraElement.page) - 1) : 1;
	G.refreshData();
}
function nextPage(){
	G.paraElement.page = parseInt(G.paraElement.page)<parseInt(qq.$("totalPage").value) ? (parseInt(G.paraElement.page) + 1) : parseInt(qq.$("totalPage").value);
	G.refreshData();
}
function gotoPage(num){
	G.paraElement.page = parseInt(num);
	G.refreshData();
}

//模板输出 列表页日期
(function(){
	var dateAjax = new Ajax("interface/date.php?" + Math.random() ,null , function(responseText){
	try{		
		var paraSite = G.paraElement.site;
		var paraDate = G.paraElement.date;
		
		var date = responseText.split(" ")[0];
		
		var currentdate = paraDate? paraDate.split("-") : date.split("-");
		qq.$("titleArea").innerHTML = currentdate[0]+"年"+currentdate[1]+"月"+currentdate[2]+"日滚动新闻";
		
		var _LISTPAGE_TIME_ = paraDate?paraDate.split("-"):date.split("-");	
		
		var _SERVER_TIME_FULL_ = responseText.split(/[- :]/);/* [2010,12,28,11,33,26]YYYY,mm,dd,HH,MM,SS */	
		
		var _LISTPAGE_URL_REG_ = "index.htm?site=" + paraSite + "&mod=$O&date=$Y-$M-$D&cata=$C";
		
		var _LIMIT_START_DATE_ = [2009,01,01];
	}
	catch (e){
	}	
	//服务器时间
	var serverDate = (typeof _SERVER_TIME_FULL_ != "undefined")?new Date(_SERVER_TIME_FULL_[0],_SERVER_TIME_FULL_[1]-1,_SERVER_TIME_FULL_[2]):new Date();
	//页面起始日期
	var currentDate = (typeof _LISTPAGE_TIME_ != "undefined")?new Date(_LISTPAGE_TIME_[0],_LISTPAGE_TIME_[1]-1,_LISTPAGE_TIME_[2]):new Date();
	//网站内容起始日期
	var limitStartDate = (typeof _LIMIT_START_DATE_ != "undefined")?new Date(_LIMIT_START_DATE_[0],_LIMIT_START_DATE_[1]-1,_LIMIT_START_DATE_[2]):new Date(2004,12-1,1);

	var _calendar_ = new GCalendar(document.getElementById("calendar"),serverDate,currentDate);//日历容器，服务器时间，日历起始时间
	if(limitStartDate)	_calendar_.limitStartDate = limitStartDate;
	_calendar_.isStatic = false;
	_calendar_.isStaticPath = _LISTPAGE_URL_REG_;//$Y 4为年 $M 2位月 $D 2位天
	_calendar_.build();
});
dateAjax.Open();
})();

function dateValidate(date){
	var regx = /^\d{4}-\d{2}-\d{2}$/ig;
	return (regx.test(date));
}
function ValidateCheck(str){
	if( !str || str=="")return false;
	var regx = /script/ig;
	return !regx.test(str);
}
function getSiteFromUrl(){
	return window.location.hostname.split(".")[1];
}

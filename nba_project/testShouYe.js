//这是与页面跳转有关的模块
	var indexUrl = '/nba_a.shtml';
	var docUrl = document.location.href;
	var maxPage = 2219;
	var curPage = 1;
	var isIndex = false;
	var showPages = 100;
	var end = docUrl.lastIndexOf("/");
	if(end > 0){
		var realDocUrl = docUrl.substring(end);
		var lastToken = realDocUrl.lastIndexOf("_");
		var lastSuffix = realDocUrl.lastIndexOf(".shtml");
		if( (realDocUrl)!= indexUrl && lastToken>0 && lastSuffix >0 && lastSuffix > lastToken ){
			curPage = realDocUrl.substring(lastToken+1,lastSuffix);
			curPage = maxPage-curPage+1;
		}else{
			isIndex = true;
		}
	}
	if(isNaN(curPage)){
		curPage = 1;
	}
	var index = "<span><b>"+curPage+"/"+(maxPage>showPages?showPages:maxPage)+"</b></span>";
	document.getElementById("pagingIndex").innerHTML=index;
	function go(page){
		try{
		var baseUrl = '/nba_a';
		//var page = document.getElementById("pagenav").value;
		var url = '';
			if (page >0&&page <=showPages){
				page = maxPage - page+1;
				if(page <= 0 || page == maxPage ){
					url = indexUrl;;			
				}else{
					url = baseUrl+'_'+page+'.shtml';			
				}
				document.location.href=url;
				return true;
			}else if(page == maxPage){
				if(maxPage > showPages){
					url = baseUrl+'_'+(maxPage-showPages+1)+'.shtml';			
				}else{
					url = baseUrl+'_1.shtml';			
				}
				document.location.href=url;
				return true;
			}else{
				return false;
			}
			}catch(e){
				alert("Sorry:"+e);
			}
		return false;
	}

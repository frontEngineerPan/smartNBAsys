var indexUrl = '/1/1102/39/subject204253982.shtml';
	var docUrl = document.location.href;
	var maxPage = 3614;//最大页面数
	var curPage = 1;
	var isIndex = false;//isIndex判定当前页的url是否是经过搜索引擎索引得出的
	var showPages = 100;//能显示的页面数
	var end = docUrl.lastIndexOf("/");//返回/最后出现的位置
	if(end > 0){
		var realDocUrl = docUrl.substring(end);//获取sdocUrl中最后一个/连带的子串
		var lastToken = realDocUrl.lastIndexOf("_");//返回在realDocUrl中_最后出现的位置
		var lastSuffix = realDocUrl.lastIndexOf(".shtml");//返回在realDocUrl中.shtml最后出现的位置
		if( (realDocUrl)!= indexUrl && lastToken>0 && lastSuffix >0 && lastSuffix > lastToken ){
			curPage = realDocUrl.substring(lastToken+1,lastSuffix);
			curPage = maxPage-curPage+1;//计算当前页数目
		}else{
			isIndex = true;//isIndex判定当前页的url是否是经过搜索引擎索引得出的
		}
	}
	if(isNaN(curPage)){//如果当前页面被判定是越界数，重新设置为1
		curPage = 1;
	}
	var index = "<span><b>"+curPage+"/"+(maxPage>showPages?showPages:maxPage)+"</b></span>";
	document.getElementById("pagingIndex").innerHTML=index;
	//页面跳转
	function go(page){
		try{
		var baseUrl = '/1/1102/39/subject204253982';
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
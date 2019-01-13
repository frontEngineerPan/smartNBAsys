//测试函数内外var缺省和不缺省带来的问题
function var_test(i){
		i=1;
		i++;
		j++;
		k=1;
		var l=2;
		console.log('fun_i:'+i);
		console.log('fun_j:'+j);
		return l;
	}
	i=4;
	j=5;
	var_test(i);
	console.log('page_i:'+i);
	console.log('page_j:'+j);
	console.log('page_k:'+k);
	console.log('page_l:'+var_test(5));
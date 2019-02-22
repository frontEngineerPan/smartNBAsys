function  a(){
    var a=3+2;
    //给了首进程3秒的时间计算，模拟同步
    setTimeout(function(){
       b(a);
    },3000);
}
function b(param){
    console.log(param);
    setTimeout(function(){
        c(param);
    },3000);
}
function c(param){
    console.log(param+1);
}
a();
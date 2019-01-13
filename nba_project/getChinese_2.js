function GetAsciiCode(){
    var str = "你好";//接收字符串
    var strAscii = new Array();//用于接收ASCII码
    for(var i = 0 ; i < str.length ; i++ ){
        strAscii[i] = str.charCodeAt(i);//只能把字符串中的字符一个一个的解码
    }
    var getAscii = "";//把这些ASCII码按顺序排列
    for(var i = 0 ; i < strAscii.length ; i++ ){
        getAscii += strAscii[i];
        getAscii += " ";
    }
    console.log("这些字符的ASCII码依次是："+getAscii);//输出结果给人看
}
GetAsciiCode();
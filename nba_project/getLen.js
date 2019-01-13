var i=58;
var midSix;
    if(i/100000>=1){
       midSix=i;
    }else if((i/10000>=1)&&(i/100000<10)){
       midSix='0'+i;
    }else if((i/1000>=1)&&(i/10000<10)){
       midSix='00'+i;
    }else if((i/100>=1)&&(i/1000<10)){
       midSix='000'+i;
    }else if((i/10>=1)&&(i/100<10)){
       midSix='0000'+i;
    }else if((i/1>=1)&&(i/10<10)){
       midSix='00000'+i;
    }
console.log(midSix);
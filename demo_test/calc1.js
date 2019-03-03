for(let i=1;i<=20;i++){
    for(let j=1;i<=16;j++){
        for(let k=1;i<=14;k++){
            if((i*16+21*j+24*k)===374&&(i+j+k===20)){
                console.log(i+' '+j+' '+k);
            }
        }
    }
}
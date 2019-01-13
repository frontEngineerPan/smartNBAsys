var test=(
function(a)
{
    console.log("a"+a);
    return function (b) {
    console.log("b:"+b);
    return this.a+b;
}
}(function(a,b){
    console.log("a,b:"+a);
    return a;
}
(1,2)
)
);
console.log("test4");
console.log(test(4));


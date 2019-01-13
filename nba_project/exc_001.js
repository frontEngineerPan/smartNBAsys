var a=[1,2,3,4,5];
console.log(Math.max(a));
//结论：Math.max()无法直接引用数组，改用Math.max.apply()或者Math.max.call()，后者需要指明参数对象，比如Math

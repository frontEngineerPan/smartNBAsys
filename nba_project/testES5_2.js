var a = 'aaa';
function b() {
    console.log(a);
    var a = 'bbb';
    console.log(a);
}
b();
console.log(a);
function a(callback) {
    // 模拟任务a耗时
    setTimeout(function() {
        console.log("task a end!");
        // 回调任务b
        callback();
    }, 3000);
};

function b() {
    setTimeout(function() {
        console.log("task b end!");
    }, 5000);
}
a(b);
var express = require('express');
var app = express();
// 请求的url
app.get('/complex.json', function(req, res) {
    // 默认返回的json 对象
    var obj = {
        "success": true
    };
    res.jsonp(obj);
});
app.listen(4100);

var express = require('express');
var router = express.Router();
var urllib = require('url');
const app = express();


router.get('/simpleJsonp', function (req, res, next){
    var params = urllib.parse(req.url, true);
    var reqData = {
        name:sb,
        pass:sb
    };
    var query = params.query;
    if(params.query && params.query.callback){
        var str =  params.query.callback + '(' + JSON.stringify(reqData) + ')';//jsonp
        res.send(str);
    }else{
        res.send(JSON.stringify(reqData));
    }
});
app.router=router;
app.listen(4300, () =>
    console.log('Example app listening on port 4300!'
    ));
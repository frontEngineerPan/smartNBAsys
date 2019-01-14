const express = require('express');
const app = express();
var mongoose = require('mongoose');
var fs = require("fs");
var process=require("process");
//process.on保证了进程遇到错误不会突然退出
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});
//连接数据库
mongoose.connect('mongodb://localhost/smartNBAsys');
var db = mongoose.connection;
/*数据库连接错误处理*/
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("now connected!");
});
//结束连接数据库
//设置跨域访问
//这一般是后端程序员做的事情
/*newUser包含用户的注册信息*/
var newUser= mongoose.Schema({
    /*以后都是userID*/
    user_id:String,
    password:String
});
/*speak方法验证是否正确插入库*/
newUser.methods.speak = function () {
    var greeting="insert False";
    if(this.user_id&&this.password){
        greeting="insert success";
    }
    console.log(greeting);
};
/*注意，newUserModel指的就是mongodb里面的集合，默认背后加s*/
var newUserModel=mongoose.model('newUserModel',newUser);
/***************以下为路由*****************/
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/auth/:id/:password', function(req, res) {
    res.send({id:req.params.id, name: req.params.password});
});
app.get('/register/:name/:word', function(req, res) {
    var obj_user={
        user_id:decodeURI(req.params.name),
        password:req.params.word
    };
    /*通过数据将model实例化*/
    var f=new newUserModel(obj_user);
    //存库
    f.save(function (err, f) {
        if (err) return console.error(err);
        f.speak();
    });
    res.send({register:"success"});
});
app.get('/login/:name/:word', function(req, res) {
    var obj_user2={
        user_id:decodeURI(req.params.name),
        password:req.params.word
    };
        try {
            newUserModel.findOne({
                'user_id': obj_user2.user_id,
                'password': obj_user2.password
            }, 'user_id password', function (err, newusermodels) {
                if (err) {
                    //console.log("用户名或者密码错误！");
                    //res.send({login: "failed"});
                    return handleError(err);
                }
                ;
                // Prints "Space Ghost is a talk show host".
                console.log('%s password is  %s.', newusermodels.user_id, newusermodels.password);
                res.send({login: "success"});
            });
        }catch(e){
            console.log(e);
            res.send({login: "failed"});
        }
});
/*****************以上为路由***********************/
app.listen(3000);
console.log('nbaServer Listening on port 3000...');


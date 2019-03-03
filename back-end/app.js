const express = require('express');
const app = express();
var mongoose = require('mongoose');
var fs = require("fs");
var process=require("process");
const R=require('./stdTeamData.js');
const DaoPaiSheet = require ('./createDaoPai.js');
const nbaPicTextX = require('./nbaPicTextX_model.js');
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
var interestLabelF={
        mate:"科比布莱恩特",
        team:"火箭",
        coach:"沃顿"
}
var interestLabelT=[];
interestLabelT.push(interestLabelF.mate);
interestLabelT.push(interestLabelF.team);
interestLabelT.push(interestLabelF.coach);
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
app.get('/displayDocs/:mate/:team/:coach', function(req, res) {
    //词根
    var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
    //用于传输结果（res）的消息
    var mateResult=[];
    //用于记录所有的nba关键词
    var wBase=[];
    //wordNum记录了关键词在序列中的下标
    var wordNum={};
    //该后台路由需要向前端提供查询文档的结果
    var mateDocs=[];
    //tfIdf_forJ是第i个关键词在j+1文档的tfIdf
    var tfIdf_forJ=[];
    //
    var mateDocsNum=[];
    var jRefer=[];
    var resultWithDocs=[];
    var interestLabel={
        mate:decodeURI(req.params.mate),
        team:decodeURI(req.params.team),
        coach:decodeURI(req.params.coach)
    }
    for (let i = 0;i < teamStr.length;i++) {
        wBase.push(R[teamStr[i]].teamName);
        wBase.push(R[teamStr[i]].coach);
        for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
            wBase.push(R[teamStr[i]].mates[j]);
        }
    }
    //在这里获取兴趣标签
    wordNum.mateNum = wBase.indexOf(interestLabelF.mate);
    //这里需要一个模糊优化算法
    wordNum.teamNum = wBase.indexOf(interestLabelF.team);
    wordNum.coachNum = wBase.indexOf(interestLabelF.coach);
               //debug
               //console.log(DaoPaiSheet[wordNum.mateNum]);
               //求5个mate项
               //wordNum.mateNum是mate项关键词下标i
               //mateDocs是包含mate词的文档下标j的集合
               //ariseDocs
               mateDocs=DaoPaiSheet[wordNum.mateNum].ariseDocs;
               for(let j=0;j<mateDocs.length;j++){
                   //注意DaoPaiSheet[wordNum.mateNum].tfidf[mateDocs[j]]是第i个关键词在j文档里面的tfidf值
                   tfIdf_forJ.push(DaoPaiSheet[wordNum.mateNum].tfidf[mateDocs[j]]);
                   var obj_j={
                       docNum:mateDocs[j],
                       docTfIdf:DaoPaiSheet[wordNum.mateNum].tfidf[mateDocs[j]]
                   };
                   jRefer.push(obj_j);
               }
               //对tfIdf_forJ数组进行排序
               tfIdf_forJ.sort();
               tfIdf_forJ.reverse();
               if(tfIdf_forJ.length<5){
                  //如果mate不足5项
                  for(let k=0;k<tfIdf_forJ.length;k++){
                      mateDocsNum.push(jRefer[k].docNum);
                  }
               }else{
                   var tmp_5=[];
                   for(let l=0;l<5;l++){
                       //如果mate足够5项，取前5项
                       tmp_5.push(tfIdf_forJ[l]);
                   }
                   for(let m=0;m<jRefer.length;m++){
                       if(tmp_5.indexOf(jRefer[m].docTfIdf)>=0){
                           mateDocsNum.push(jRefer[m].docNum);
                       }
                   }
               }
               //mateResult是球员相关的文档编号
               mateResult=mateDocsNum;

/*****下面开始写team版本******/
    //teamDocsNum是teamResult的中转变量
    var teamDocsNum=[];
    //teamResult是最终的输出
    var teamResult=[];
    //TeamJ_tfidf保存了球队关键词在不同的文档里面的tfidf值
    var TeamJ_tfidf=[];
    //jTeamRefer提供TeamJ_tfidf的值-标号查询
    var jTeamRefer=[];
    var teamDocs=[];
    if(DaoPaiSheet[wordNum.teamNum].ariseDocs.length>0){
    //取包含关键词湖人的文档编号
    teamDocs=DaoPaiSheet[wordNum.teamNum].ariseDocs;
    //求该关键词在不同的文档里面的tfidf值
    //伪码表示为DaoPaiSheet[wordNum.teamNum].tfidf[teamDocs[j]]
    for(let j=0;j<teamDocs.length;j++){
        var obj_j={};
        TeamJ_tfidf.push(DaoPaiSheet[wordNum.teamNum].tfidf[teamDocs[j]]);
        obj_j={
            docNum:teamDocs[j],
            docTfIdf:DaoPaiSheet[wordNum.teamNum].tfidf[teamDocs[j]]
        };
        jTeamRefer.push(obj_j);
    }
    //对TeamJ_tfidf数组进行排序
    TeamJ_tfidf.sort();
    TeamJ_tfidf.reverse();
    //判定和输出
    if(TeamJ_tfidf.length<3){
        //如果team不足3项
        for(let k=0;k<TeamJ_tfidf.length;k++){
            teamDocsNum.push(jTeamRefer[k].docNum);
        }
    }else{
        var tmp_3=[];
        for(let l=0;l<3;l++){
            //如果team足够3项，取前5项
            tmp_3.push(TeamJ_tfidf[l]);
        }
        for(let m=0;m<TeamJ_tfidf.length;m++){
            if(tmp_3.indexOf(jTeamRefer[m].docTfIdf)>=0){
                teamDocsNum.push(jTeamRefer[m].docNum);
            }
        }
    }
    teamResult=teamDocsNum;
    }else{
        console.log("teamResult kong");
    }
    /*****以上是team版本******/
   //对coach版本进行重写
    var coachDocsNum=[];
    var coachResult=[];
    var coachJ_tfidf=[];
    var jCoachRefer=[];
    var coachDocs=[];
    if(DaoPaiSheet[wordNum.coachNum].ariseDocs.length>0){
        coachDocs=DaoPaiSheet[wordNum.coachNum].ariseDocs;
        for(let j=0;j<coachDocs.length;j++){
            var obj_j={};
            coachJ_tfidf.push(DaoPaiSheet[wordNum.coachNum].tfidf[coachDocs[j]]);
            obj_j={
                docNum:coachDocs[j],
                docTfIdf:DaoPaiSheet[wordNum.coachNum].tfidf[coachDocs[j]]
            };
            jCoachRefer.push(obj_j);
        }
        coachJ_tfidf.sort();
        coachJ_tfidf.reverse();
        if(coachJ_tfidf.length<2){
            for(let k=0;k<coachJ_tfidf.length;k++){
                coachDocsNum.push(jCoachRefer[k].docNum);
            }
        }else{
            var tmp_2=[];
            for(let l=0;l<2;l++){
                tmp_2.push(coachJ_tfidf[l]);
            }
            for(let m=0;m<coachJ_tfidf.length;m++){
                if(tmp_2.indexOf(jCoachRefer[m].docTfIdf)>=0){
                    coachDocsNum.push(jCoachRefer[m].docNum);
                }
            }
        }
        coachResult=coachDocsNum;
    }else{
        console.log("coachResult kong");
    }
        //以上是coach版本
    var resultK=[];
    resultK=mateResult.concat(teamResult).concat(coachResult);
    //最后使用res.send()去
    //处理查询
   mongoose.connect('mongodb://localhost/smartNBAsys');
    var db = mongoose.connection;
    //数据库连接错误处理
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // we're connected!
        console.log("database for docs now connected!");
    });
    for(let n=0;n<resultK.length;n++){
        nbaPicTextX.find({nba_id:resultK[n]}, 'nba_id title content', function (err, result) {
            var obj={
                position:n+1,
                id:result[0].nba_id,
                title:result[0].title,
                content:result[0].content
            }
            resultWithDocs.push(obj);
        });
    }
    setTimeout(function () {
        res.send(resultWithDocs);
    },3000);
});
/*模板signal
app.get('/login/:name/:word', function(req, res) {
        res.send({login: "failed"});
});*/
app.get('/getLabel', function(req, res) {
    res.send(interestLabelT);
});
app.get('/updateAppData/:mate/:team/:coach', function(req, res) {
    interestLabelF={
        mate:decodeURI(req.params.mate),
        team:decodeURI(req.params.team),
        coach:decodeURI(req.params.coach)
    };
    console.log("现在开始重置兴趣标签");
    interestLabelT=[];
    interestLabelT.push(interestLabelF.mate);
    interestLabelT.push(interestLabelF.team);
    interestLabelT.push(interestLabelF.coach);
    console.log(interestLabelT);
    res.send("update interest Success!");
});
app.get('/downloadTotalWords', function(req, res) {
    var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
    var wBase=[];
    for (let i = 0;i < teamStr.length;i++) {
        var obj_1={
             value:R[teamStr[i]].teamName
        };
        var obj_2={
            value:R[teamStr[i]].coach
        };
        wBase.push(obj_1);
        wBase.push(obj_2);
        for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
            var obj_3={
                value:R[teamStr[i]].mates[j]
            };
            wBase.push(obj_3);
        }
    }
    res.send(wBase);
});
app.get('/getWordArray/:num', function(req, res) {
    var wNum=parseInt(req.params.num);
//设定结果num组
    var wDocsNum=[];
//出现在哪些文档里面
    var wDocs=[];
//方便排序结果的查询
    var jWRefer=[];
//最终res的结果
    var resultWithDocsW=[];
    //wJ_tfidf记录w词在j文档里面的tfidf值
    var wJ_tfidf=[];
//假如该组的所有倒排检索都为空，输出空
//否则攫取倒排结果
    if(DaoPaiSheet[wNum].ariseDocs.length>0){
//出现在哪些文档里面
        wDocs=DaoPaiSheet[wNum].ariseDocs;
        for(let j=0;j<wDocs.length;j++){
            var obj_j={};//中间值，方便数值排序
            //wJ_tfidf记录w词在j文档里面的tfidf值
            wJ_tfidf.push(DaoPaiSheet[wNum].tfidf[wDocs[j]]);
            obj_j={
                docNum:wDocs[j],//w词出现在哪个文档
                //tfidf值
                docTfIdf:DaoPaiSheet[wNum].tfidf[wDocs[j]]
            };
            //push
            jWRefer.push(obj_j);
        }
        wJ_tfidf.sort();
        wJ_tfidf.reverse();
        for(let m=0;m<wJ_tfidf.length;m++){
            if(wJ_tfidf.indexOf(jWRefer[m].docTfIdf)>=0){
                wDocsNum.push(jWRefer[m].docNum);
            }
        }
    }else{
        console.log("w Word not found!");
    }
    //传输文档内容和编号
    mongoose.connect('mongodb://localhost/smartNBAsys');
    var db = mongoose.connection;
    //数据库连接错误处理
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // we're connected!
        console.log("database for docs now connected!");
    });
    for(let n=0;n<wDocsNum.length;n++){
        nbaPicTextX.find({nba_id:wDocsNum[n]}, 'nba_id title content', function (err, result) {
            var obj={
                position:n+1,
                id:result[0].nba_id,
                title:result[0].title,
                content:result[0].content
            }
            resultWithDocsW.push(obj);
        });
    }
    setTimeout(function () {
        res.send(resultWithDocsW);
    },3000);
});
app.get('/getMateData',function (req,res) {
    var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
    var wBase=[];
    for (let i = 0;i < teamStr.length;i++) {
        for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
            var obj_3={
                value:R[teamStr[i]].mates[j]
            };
            wBase.push(obj_3);
        }
    }
    res.send(wBase);
});
app.get('/getTeamData',function (req,res) {
    var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
    var wBase=[];
    for (let i = 0;i < teamStr.length;i++) {
        var obj_2={
            value:R[teamStr[i]].teamName
        };
        wBase.push(obj_2);
    }
    res.send(wBase);
});
app.get('/getCoachData',function (req,res) {
    var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
    var wBase=[];
    for (let i = 0;i < teamStr.length;i++) {
        var obj_3={
            value:R[teamStr[i]].coach
        };
        wBase.push(obj_3);
    }
    res.send(wBase);
});
app.get('/postMateData/:postMate',function(req,res){
    interestLabelF.mate=decodeURI(req.params.postMate);
    console.log(interestLabelF.mate);
    res.send({"success":interestLabelF.mate});
});
app.get('/postTeamData/:postTeam',function(req,res){
    interestLabelF.team=decodeURI(req.params.postTeam);
    console.log(interestLabelF.team);
    res.send({"success":interestLabelF.team});
});
app.get('/postCoachData/:postCoach',function(req,res){
    interestLabelF.coach=decodeURI(req.params.postCoach);
    console.log(interestLabelF.coach);
    interestLabelT=[];
    interestLabelT.push(interestLabelF.mate);
    interestLabelT.push(interestLabelF.team);
    interestLabelT.push(interestLabelF.coach);
    res.send({"success":interestLabelF.coach});
});
/*****************以上为路由***********************/
app.listen(3000);
console.log('nbaServer Listening on port 3000...');


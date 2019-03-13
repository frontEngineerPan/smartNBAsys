const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require("fs");
const process=require("process");
const R=require('./stdTeamData.js');
const DaoPaiSheet = require ('./createDaoPai.js');
const jieba = require ('nodejieba');
const nbaPicTextX = require('./nbaPicTextX_model.js');
//装载jieba分词
jieba.load({
    dict: jieba.DEFAULT_DICT,
    hmmDict: jieba.DEFAULT_HMM_DICT,
    userDict: './Dict8.utf8',
    idfDict: jieba.DEFAULT_IDF_DICT,
    stopWordDict: jieba.DEFAULT_STOP_WORD_DICT,
});
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
var nIntervId=[];
//用于打印时间值的函数
function changeTime(num) {
    //重定义
    nIntervId[num] = setInterval(function () {
        timeRecord[num].accumTime++;
    }, 1000);
}
//用于结束结束时间值的函数
function endChange(num){
    clearInterval(nIntervId[num]);
    //构建nba标准词库
    //找词找得我好辛苦
    var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
    var wBase=[];
    for (let i = 0;i < teamStr.length;i++) {
        wBase.push(R[teamStr[i]].teamName);
        wBase.push(R[teamStr[i]].coach);
        for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
            wBase.push(R[teamStr[i]].mates[j]);
        }
    }
    var AccumulativeTime=parseInt(timeRecord[num].accumTime/60);
    timeRecord[num].accumTime=0;
    var CorrespondingWords=wBase[timeRecord[num].wNum];
    for(let i=0;i<interestPool.length;i++){
        if(interestPool[i].secondLabel===CorrespondingWords){
            interestPool[i].account=interestPool[i].account+AccumulativeTime;
        }
    }
}
//timeRecord用于记录时间，格式【词在wBase里面的位置，词的总时间，若词的选项卡被关闭，重置时间点】
var timeRecord=[];
/*interestPool兴趣池*/
var interestPool=[];
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
app.get('/registerInterest/:newInterest',function(req,res){
    var isKey=false;
    var keyNum=null;
    if(interestPool.length>0) {
        for(let i=0;i<interestPool.length;i++){
            if(interestPool[i].secondLable===decodeURI(req.params.newInterest)){
                isKey=true;
                keyNum=i;
            }
        }
    }
    if(!isKey&&!keyNum){
        var obj={
            secondLabel:key,
            account:1
        };
        interestPool.push(obj);
    }else{
        interestPool[keyNum].account++;
    }
    res.send(interestPool);
});
app.get('/recognizeInterest/:wNum',function(req,res){
    //为了方便记录时间，使用tmpTime做输出
    var tmpTimeNum=0;
    //连接数据库取文本
    mongoose.connect('mongodb://localhost/smartNBAsys');
    var db = mongoose.connection;
    //数据库连接错误处理
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // we're connected!
        console.log("database for docs now connected!");
    });
    nbaPicTextX.find({nba_id:req.params.wNum}, 'content', function (err, result) {
        //定义快排
        var quickSort = function(arr) {
            if (arr.length <= 1) { return arr; }
            var pivotIndex = Math.floor(arr.length / 2);
            var pivot = arr.splice(pivotIndex, 1)[0];
            var left = [];
            var right = [];
            for (var i = 0; i < arr.length; i++){
                if (arr[i] < pivot) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            return quickSort(left).concat([pivot], quickSort(right));
        };
        //构建nba标准词库
        var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
        var wBase=[];
        for (let i = 0;i < teamStr.length;i++) {
            wBase.push(R[teamStr[i]].teamName);
            wBase.push(R[teamStr[i]].coach);
            for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
                wBase.push(R[teamStr[i]].mates[j]);
            }
        }
        //docs念做集
        var cp_result=result[0].content.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
        var resultDocs=jieba.cut(result);
        //统计词频
        //reducer是好东西,自动升序
        var countedNames = resultDocs.reduce(function (allNames, name) {
            if (name in allNames) {
                allNames[name]++;
            }
            else {
                allNames[name] = 1;
            }
            return allNames;
        }, {});
        //设置一个数组用于排序
        var tmp=[];
        //使用tmpforSort来存储排序后的数组
        var tmpforSort=[];
        for(let key in countedNames){
            tmp.push(parseInt(countedNames[key]));
        }
        //使用tmpforSort来存储排序后的数组
        //这里有错误，它将其按字符串进行排序了
        var tmpforSort=quickSort(tmp);
        tmpforSort.reverse();
        //tmpForLabel负责取次标签
        var tmpForLabel=0;
        while(tmpForLabel!=10000){
            for(let key in countedNames) {
                //符合条件的才注册//找到的话就在兴趣池里面注册
                //严格规约次级标签
                if (tmpforSort[tmpForLabel]===countedNames[key]&&wBase.indexOf(key)>=0&&key!=interestLabelF.mate&&key!=interestLabelF.team&&key!=interestLabelF.coach){
                    //计算该词在wBase里面的位置
                    tmpTimeNum=wBase.indexOf(key);
                    var isKey=false;
                    var keyNum=null;
                    //如果该次标签已经在之前的兴趣池里面
                    if(interestPool.length>0) {
                        for(let i=0;i<interestPool.length;i++){
                            if(interestPool[i].secondLabel===key){
                                isKey=true;
                                keyNum=i;
                            }
                        }
                    }
                    //如果该次标签已经在之前的兴趣池里面
                    if(!isKey&&keyNum===null){
                        var obj={
                            secondLabel:key,
                            account:parseInt(1)
                        };
                        interestPool.push(obj);
                        //否则新进行注册
                    }else{
                        interestPool[keyNum].account++;
                    }
                    tmpForLabel=9999;
                    break;
                }
            }
            tmpForLabel++;
        }
        //注册time并开始计算
        var obj_c={
            wNum:tmpTimeNum,
            accumTime:0
        }
        timeRecord.push(obj_c);
        //开始计时
        //numForRecord是wBase某词word在timeRecord中的位置
        let numForRecord;
        if(timeRecord.length>0){
            for(let i=0;i<timeRecord.length;i++){
                //tmpTimeNum是词在wBase当中的位置
                if(timeRecord[i].wNum===tmpTimeNum){
                    numForRecord=i;
                }
            }
        }
        changeTime(numForRecord);
        //注意interestPool是关于当前次标签的兴趣池
        //res只能传输json格式的数据
        setTimeout(function(){
            res.send(interestPool);
        },1000);
    });
});
app.get('/endTimeAccount/:wNum',function(req,res){
    //为了方便记录时间，使用tmpTime做输出
    var tmpTimeNum=0;
    //连接数据库取文本
    mongoose.connect('mongodb://localhost/smartNBAsys');
    var db = mongoose.connection;
    //数据库连接错误处理
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // we're connected!
        console.log("database for docs now connected!just for end time!");
    });
    nbaPicTextX.find({nba_id:req.params.wNum}, 'content', function (err, result) {
        //定义快排
        var quickSort = function(arr) {
            if (arr.length <= 1) { return arr; }
            var pivotIndex = Math.floor(arr.length / 2);
            var pivot = arr.splice(pivotIndex, 1)[0];
            var left = [];
            var right = [];
            for (var i = 0; i < arr.length; i++){
                if (arr[i] < pivot) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            return quickSort(left).concat([pivot], quickSort(right));
        };
        //构建nba标准词库
        var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
        var wBase=[];
        for (let i = 0;i < teamStr.length;i++) {
            wBase.push(R[teamStr[i]].teamName);
            wBase.push(R[teamStr[i]].coach);
            for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
                wBase.push(R[teamStr[i]].mates[j]);
            }
        }
        //docs念做集
        var cp_result=result[0].content.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
        var resultDocs=jieba.cut(result);
        //统计词频
        //reducer是好东西,自动升序
        var countedNames = resultDocs.reduce(function (allNames, name) {
            if (name in allNames) {
                allNames[name]++;
            }
            else {
                allNames[name] = 1;
            }
            return allNames;
        }, {});
        //设置一个数组用于排序
        var tmp=[];
        //使用tmpforSort来存储排序后的数组
        var tmpforSort=[];
        for(let key in countedNames){
            tmp.push(parseInt(countedNames[key]));
        }
        //使用tmpforSort来存储排序后的数组
        //这里有错误，它将其按字符串进行排序了
        var tmpforSort=quickSort(tmp);
        tmpforSort.reverse();
        //tmpForLabel负责取次标签
        var tmpForLabel=0;
        while(tmpForLabel!=10000){
            for(let key in countedNames) {
                //符合条件的才注册//找到的话就在兴趣池里面注册
                //严格规约次级标签
                if (tmpforSort[tmpForLabel]===countedNames[key]&&wBase.indexOf(key)>=0&&key!=interestLabelF.mate&&key!=interestLabelF.team&&key!=interestLabelF.coach){
                    //计算该词在wBase里面的位置
                    tmpTimeNum=wBase.indexOf(key);
                    tmpForLabel=9999;
                    break;
                }
            }
            tmpForLabel++;
        }
        //numForRecord是wBase某词word在timeRecord中的位置
        let numForRecord;
        if(timeRecord.length>0){
            for(let i=0;i<timeRecord.length;i++){
                //tmpTimeNum是词在wBase当中的位置
                if(timeRecord[i].wNum===tmpTimeNum){
                    numForRecord=i;
                }
            }
        }
        endChange(numForRecord);
        //注意interestPool是关于当前次标签的兴趣池
        //res只能传输json格式的数据
        setTimeout(function(){
            res.send(interestPool);
        },1000);
    });
});
app.get('/getBySecondaryLabel',function(req,res){
    //sortPool用于排序
    let sortPool=[];
    //wordPool记录了要输出的词组
    let wordPool=[];
    //numFromWBase记录了要输出的词组在wbase中的编号
    let numFromWBase=[];
    //最终用于输出的结果
    let resultWithDocsW=[];
    if(interestPool.length>0){
       for(let i=0;i<interestPool.length;i++){
           sortPool.push(interestPool[i].account);
       }
        sortPool.sort();
        sortPool.reverse();
        if(interestPool.length<=5){
            for(let i=0;i<interestPool.length;i++){
                wordPool.push(interestPool[i].secondLabel);
            }
        }else{
            for(let i=0;i<5;i++){
                wordPool.push(interestPool[i].secondLabel);
            }
        }
        //构建nba标准词库
        //找词找得我好辛苦
        var teamStr = ["bucksNBA", "pelicanNBA", "warriorsNBA", "clippersNBA", "kingNBA", "raptorsNBA", "lakersNBA", "hornetsNBA", "wizardsNBA", "thunderNBA", "celticsNBA", "spursNBA", "blazersNBA", "timberwolvesNBA", "netsNBA", "mavericksNBA", "sixersNBA", "nuggetsNBA", "rocketNBA", "jazzNBA", "nicksNBA", "pacersNBA", "bullNBA", "pistonNBA", "grizzlieNBA", "knightNBA", "heatNBA", "magicNBA", "sunNBA", "eagleNBA"];
        var wBase=[];
        for (let i = 0;i < teamStr.length;i++) {
            wBase.push(R[teamStr[i]].teamName);
            wBase.push(R[teamStr[i]].coach);
            for (let j = 0; j < R[teamStr[i]].mates.length; j++) {
                wBase.push(R[teamStr[i]].mates[j]);
            }
        }
        //寻找在在wbase中的编号
        for(let i=0;i<wBase.length;i++){
            if(wordPool.indexOf(wBase[i])>=0){
                numFromWBase.push(i);
            }
        }
        //到倒排索引表里面去取结果
        for(let i=0;i<numFromWBase.length;i++){
            if(DaoPaiSheet[numFromWBase[i]].ariseDocs.length>0){
                //出现在哪些文档里面
                let wDocs=DaoPaiSheet[numFromWBase[i]].ariseDocs;
                //wJ_tfidf记录了i词在关于它的文档里面的所有tfidf值
                let wJ_tfidf=[];
                //jWRefer记录了i词在哪些文档里面，以及背后的tfidf值，方便排序后的查询
                let jWRefer=[];
                //wDocsNum是tfidf排序后的结果换算为映射后的有序的文档编号
                let wDocsNum=[];
                //记录i词在j文档里面的tfidf值
                for(let j=0;j<wDocs.length;j++){
                    wJ_tfidf.push(DaoPaiSheet[numFromWBase[i]].tfidf[wDocs[j]]);
                    let obj_j={
                        //i词出现在哪个文档
                        docNum:wDocs[j],
                        //i词在该文档的tfidf值
                        docTfIdf:DaoPaiSheet[numFromWBase[i]].tfidf[wDocs[j]]
                    };
                    jWRefer.push(obj_j);
                }
                wJ_tfidf.sort();
                wJ_tfidf.reverse();
                //将tfidf排序后的结果换算为映射后的有序的文档编号 wDocsNum
                for(let m=0;m<wJ_tfidf.length;m++){
                    if(wJ_tfidf.indexOf(jWRefer[m].docTfIdf)>=0){
                        wDocsNum.push(jWRefer[m].docNum);
                    }
                }
                //根据wDocsNum编号取数据库内容
                //连接数据库
                mongoose.connect('mongodb://localhost/smartNBAsys');
                var db = mongoose.connection;
                //数据库连接错误处理
                db.on('error', console.error.bind(console, 'connection error:'));
                db.once('open', function() {
                    // we're connected!
                    console.log("database for guessDocs now connected!");
                });
                if(wDocsNum.length<=2){
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
                }else{
                    for(let n=0;n<2;n++){
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
                }
            }
        }
        setTimeout(function () {
            res.send(resultWithDocsW);
        },3000);
    }else{
        res.send({"failed":"no interest in Pool"});
    }
});
/*****************以上为路由***********************/
app.listen(3000);
console.log('nbaServer Listening on port 3000...');


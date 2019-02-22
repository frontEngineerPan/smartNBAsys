/*算法模块正常编写就行了，因为计算本身就是同步的，然后通过回调的方式保证先计算再输出*/
const mongoose = require ('mongoose');
const jieba = require ('nodejieba');
const fs = require('fs');
var R = require('./stdTeamData.js');
const nbaPicTextX = require('./nbaPicTextX_model.js');
//连接数据库
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
//docs是格式化的查询结果
var docs=[];
//jiebaDocs是分词后的文档集
var jiebaDocs=[];
//wBase记录了所有的nba关键词
var wBase=[];
//cpResult记录了查询的结果项
var cpResult=[];
//wordInfo记录了词的三元信息
var wordInfo=[];
//结巴词库
//使用结巴默认的停用词表
jieba.load({
    dict: jieba.DEFAULT_DICT,
    hmmDict: jieba.DEFAULT_HMM_DICT,
    userDict: './Dict8.utf8',
    idfDict: jieba.DEFAULT_IDF_DICT,
    stopWordDict: jieba.DEFAULT_STOP_WORD_DICT,
});
var teamStr=["bucksNBA","pelicanNBA","warriorsNBA","clippersNBA","kingNBA","raptorsNBA","lakersNBA","hornetsNBA","wizardsNBA","thunderNBA","celticsNBA","spursNBA","blazersNBA","timberwolvesNBA","netsNBA","mavericksNBA","sixersNBA","nuggetsNBA","rocketNBA","jazzNBA","nicksNBA","pacersNBA","bullNBA","pistonNBA","grizzlieNBA","knightNBA","heatNBA","magicNBA","sunNBA","eagleNBA"];
//读取x长度的nba关键词
for(let i=0;i<teamStr.length;i++){
    wBase.push(R[teamStr[i]].teamName);
    wBase.push(R[teamStr[i]].coach);
    for(let j=0;j<R[teamStr[i]].mates.length;j++){
        wBase.push(R[teamStr[i]].mates[j]);
    }
}
//console.log(wBase);
//查询
nbaPicTextX.find({}, 'nba_id content', function (err, result) {
    if (err) return handleError(err);
    cpResult=result;
    for(let i=0;i<cpResult.length;i++) {
        //清除文档的无关字符
        docs[cpResult[i].nba_id] = cpResult[i].content.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
    }
    for(let i=0;i<docs.length;i++){
        jiebaDocs[i]=jieba.cut(docs[i]);
    }
    //ariseDocs记录了关键词在哪些文档里出现
    for(let i=0;i<wBase.length;i++){
        var ariseNum=[];
        for(let j=0;j<jiebaDocs.length;j++){
            if(jiebaDocs[j].indexOf(wBase[i])>0){
                ariseNum.push(j);
            }
        }
        wordInfo[i]={
            ariseDocs:ariseNum,
            idf:Math.log10(jiebaDocs.length/ariseNum.length)
        };
    }
    //计算词频
    //总是使用下标代表词语
    //下标和原文档编号存在加1调和
    for(let i=0;i<wordInfo.length;i++){
        var tfDocs=[];
        var tfIdfDocs=[];
        if(wordInfo[i].ariseDocs!=undefined&&wordInfo[i].ariseDocs.length>0){
            for(let j=0;j<jiebaDocs.length;j++){
                var wdNum=0;
                jiebaDocs[j].forEach(function(e){
                    if(e===wBase[i]){
                        wdNum++;
                    }
                });
                tfDocs[j]=wdNum/jiebaDocs[j].length;
                tfIdfDocs[j]=tfDocs[j]*wordInfo[i].idf;
            }
        }
        wordInfo[i].tf=tfDocs;
        wordInfo[i].tfidf=tfIdfDocs;
    }
});
module.exports=wordInfo;
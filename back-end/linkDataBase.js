const mongoose = require('mongoose');
const DaoPaiSheet = require ('./createDaoPai.js');
const nbaPicTextX = require('./nbaPicTextX_model.js');
//连接数据库
mongoose.connect('mongodb://localhost/smartNBAsys');
var db = mongoose.connection;
/*数据库连接错误处理*/
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("now connected!");
});
nbaPicTextX.find({nba_id:3695}, 'nba_id content', function (err, result) {
    if (err) return handleError(err);
    console.log(result);
});
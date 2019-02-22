var mongoose = require('mongoose');
var picTextSchema = mongoose.Schema({
    nba_id:Number,
    title:String,
    content:String
});
module.exports =  mongoose.model('nbaPicTextX',picTextSchema);
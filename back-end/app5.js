var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/');
var fs = require("fs");//这是nodejs内置的
var Schema = mongoose.Schema;
var testInsert=new Schema(
    {
        user_id:String,
        password:String
    }
);
var justTestInsert = mongoose.model('justTestInsert', testInsert);
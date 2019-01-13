var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("now connected!");
});
/*模式:文档格式*/
var kittySchema = mongoose.Schema({
  name: String
});
kittySchema.methods.speak = function () {
  var greeting = this.name? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}
var Kitten = mongoose.model('Kitten', kittySchema);
var fluffy = new Kitten({ name: '88888888' });//在这里对数据进行复制
fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
});
const Step = require('step');
Step(
    function readSelf() {
        var a="nihao";
        return a;
    },
    function capitalize(err, text) {
        if (err) throw err;
        return text.toUpperCase();
    },
    function showIt(err, newText) {
        if (err) throw err;
        console.log(newText);
    }
);
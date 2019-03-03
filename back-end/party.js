const fs = require('fs');
const readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function(error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    });
};
const gen = function* () {
    const f1 = yield readFile('C://Users//Shinelon//Documents//smartNBAsys//back-end//新建文本文档.txt');
    const f2 = yield readFile('C://Users//Shinelon//Documents//smartNBAsys//back-end//新建文本文档.txt');
    console.log(f1.toString());
    console.log(f2.toString());
};
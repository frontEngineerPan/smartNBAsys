const fs = require('fs') //创建文件、文件夹
const cheerio = require('cheerio') //cheerio爬虫
const requests = require('sync-request') //node的网络请求
const request = require('request') //利用request模块保存图片
var html = '';
let count = 0 // 记录扒取的图片数量
let imgDirName = '' // 图片存放的目录
//let url = "https://tuchong.com/443122/15624611/"; // 目标网站
//let url = "https://www.sohu.com/a/279744810_458722"; // 目标网站
let url = "https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1544099027458_R&pv=&ic=0&nc=1&z=0&hd=0&latest=0&copyright=0&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=%E9%A9%AC%E5%88%BA"; // 目标网站
// 拿到网站内容转化成html字符串
html = requests('GET', url).getBody().toString();
console.log(html);
// 调用自己的方法
filterSlideList(html);
function filterSlideList(html) {
    if (html) {
        var $ = cheerio.load(html); // 利用cheerio模块将完整的html装载到变量$中，之后就可以像jQuery一样操作html了
        // 拿到图片的父容器
        //var $imgdom = $("article.post-content");
        var $imgdom = $("article");
        // 拿到主题,并使用主题名字(名字太长，截取一下)创建文件夹
        var imgarrname = $("title").text().substr(0, 5);
        console.log("开始爬 " + imgarrname + " 主题的图片")
        //创建放图片的文件夹
        fs.mkdir('./img/' + imgarrname + '/', (err) => {
            if (err) {
                console.log(err)
            }
        })
        //取每一张图片，并把图片放到目录下
        $imgdom.find('img').each(function(index, el) {
            var imgurl = $(this).attr("src"), //拿到图片的在线链接
                imgnam = $(this).attr("alt"), //拿到图片的标题
                imgid = $(this).attr("id"); //图片名字有可能重复，取到唯一id
            // 利用request模块保存图片
            request(imgurl).pipe(fs.createWriteStream('./img/' + imgarrname + '/' + imgnam + imgid + '.jpg'))
            // '''''''''''''''''''''''''''''''''''''''''''''''''图片目录'''''''''''''   拼接的图片名    '''''
            count++;
            console.log(imgurl);
            console.log(imgnam);
            console.log('已爬取图片' + count + '张');
        });
    }
}
var fs = require('fs'), 
 path = require('path'), 
 util = require('util'), // 以上为Nodejs自带依赖包 
 request = require('request'); // 需要npm install的包  
// main函数，使用 node main执行即可 
patchPreImg(); 
// 批量处理图片 
function patchPreImg() { 
  var tag1 = '摄影', tag2 = '国家地理', 
  url = 'http://image.baidu.com/data/imgs?pn=%s&rn=60&p=channel&from=1&col=%s&tag=%s&sort=1&tag3=', 
  url = util.format(url, 0, tag1, tag2), 
  url = encodeURI(url), 
  dir = 'C:/Users/Shinelon/Documents/HBuilderProjects/jsCrawler/img/', 
  dir = path.join(dir, tag1, tag2), 
  dir = mkdirSync(dir); 
  
 request(url, function(error, response, html) { 
  var data = JSON.parse(html); 
  if (data && Array.isArray(data.imgs)) { 
   var imgs = data.imgs; 
   imgs.forEach(function(img) { 
    if (Object.getOwnPropertyNames(img).length > 0) { 
     var desc = img.desc || ((img.owner && img.owner.userName) + img.column); 
     desc += '(' + img.id + ')'; 
     var downloadUrl = img.downloadUrl || img.objUrl; 
     downloadImg(downloadUrl, dir, desc); 
    } 
   }); 
  } 
 }); 
} 
// 循环创建目录 
function mkdirSync(dir) { 
 var parts = dir.split(path.sep); 
 for (var i = 1; i <= parts.length; i++) { 
  dir = path.join.apply(null, parts.slice(0, i)); 
  fs.existsSync(dir) || fs.mkdirSync(dir); 
 } 
 return dir; 
} 
  
var index = 1; 
// 开始下载图片，并log统计日志 
function downloadImg(url, dir, desc) { 
 var fileType = 'jpg'; 
 if (url.match(/\.(\w+)$/)) fileType = RegExp.$1; 
 desc += '.' + fileType; 
 var options = { 
  url: url, 
  headers: { 
   Host: 'f.hiphotos.baidu.com', 
   Cookie: 'BAIDUID=810ACF57B5C38556045DFFA02C61A9F8:FG=1;'
  } 
 }; 
 var startTime = new Date().getTime(); 
 request(options).on('response', function() { var endTime = new Date().getTime(); console.log('Downloading...%s.. %s, 耗时: %ss', index++, desc, (endTime - startTime) / 1000); 
  }).pipe(fs.createWriteStream(path.join(dir, desc))); 
  }
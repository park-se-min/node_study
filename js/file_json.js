// 안됨.
var fs = require('fs');

var data = fs.readFileSync('../package.json', 'utf-8');

console.log(data);
var calc = require("./calc");
console.log('결과 : %d', calc.add(5, 10));

var calc2 = require("./calc2");
console.log('결과 : %d', calc2.add(15, 10));

var nconf = require('nconf');
nconf.env();
console.log('값 : %s', nconf.get('OS'));
/*
var calc = require("./calc");
console.log('결과 : %d', calc.add(5, 10));

var calc2 = require("./calc2");
console.log('결과 : %d', calc2.add(15, 10));

var nconf = require('nconf');
nconf.env();
console.log('값 : %s', nconf.get('OS'));
 */

var Calc = require('./calc3');

var calc = new Calc();

calc.emit('stop');
console.log(calc.add(1, 25));

console.log(Calc.title);
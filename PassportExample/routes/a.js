var bbb = require('./b');

console.log(bbb.add(5, 7));
console.log(bbb.add_plus(5, 7));

var a = {};
a['aa'] = '1';
a['bb'] = '2';
a.cc = '3';
a.dd = {
	id: 321
};
a.ee = [];
var del = function (a, b) {
	return a - b;
}
a.ee.push(del)


console.log(a['aa']);
console.log(a.aa);
console.log(a['cc']);
console.log(a.dd.id);
console.log(a.ee[0](50, 33));
// console.log(a.ee[0][0].del(10, 4));
console.log(a);
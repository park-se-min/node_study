var bbb = {};
var ccc = require('./c');

bbb.add = function (a, b) {
	return a + b;
}

bbb.add_plus = function (a, b) {
	return ccc.add(ccc.config.b_val, ccc.config.c_val);
}

module.exports = bbb;
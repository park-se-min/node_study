// var user = require('./module_test7');
// var p_arr = {
// 	'id': 'tes111t',
// 	'name': '소222녀'
// }
// user.value_update(p_arr);
// user.printUser();


var User = require('./module_test7');
var p_arr = {
	'id': 'tes111t',
	'name': '소222녀'
}
var user = new User(p_arr);
user.printUser();
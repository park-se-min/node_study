// var user = require('./module_test1');
// var user = require('./module_test2');
// var user = require('./module_test4');
var user = require('./module_test4');

console.dir(user);

function a() {
	return user().name + ' + ' + user().id;
	// return user.getUser().name + ' + ' + user.group.id;
	// return user.getUser('adlkjsd').bbb + ' + ' + user.group.id;
}

console.log(a());

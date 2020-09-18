// DB 변수들
var database;
var UserSchema;
var UserModel;

var init = function (db, schema, model) {
	database = db;
	UserSchema = schema;
	UserModel = model;
}

var authUser = function (p_arr, callback) {
	// console.log('authUser');

	// var users = database.collection('users');

	var {
		id,
		password
	} = p_arr;

	var users_data = {
		'id': id,
		"password": password
	}

	UserModel.findById(id, function (err, results) {
		if (err) {
			callback(err, null);
			return;
		}

		console.log('---------');
		console.dir(results);
		console.log('---------');

		if (results.length > 0) {
			console.log('아이디 찾음');

			if (results[0]._doc.password == password) {
				console.log('비밀번호 찾음');
				callback(null, results);
			} else {
				console.log('비밀번호 XXXXXXXX');
				callback(null, null);
			}
		} else {
			console.log('XXXXXXXXX');
			callback(null, null);
		}
	})

	// UserModel.find(users_data, function (err, results) {
	// 	if (err) {
	// 		callback(err, null);
	// 		return;
	// 	}

	// 	// console.log('---------');
	// 	// console.dir(results);
	// 	// console.log('---------');

	// 	if (results.length > 0) {
	// 		console.log('아이디 %s, 비밀번호 %s', id, password);
	// 		callback(null, results);
	// 	} else {
	// 		console.log('XXXXXXXXX');
	// 		callback(null, null);
	// 	}
	// })
}

// 사용자 추가
var addUser = function (p_arr, callback) {
	console.log('addUser');

	var {
		id,
		password,
		name
	} = p_arr;

	var user = new UserModel(p_arr);
	// var user = new UserModel({'id':id, 'password':password, 'name'});
	user.save(function (err) {
		if (err) {
			callback(err, null);
			return;
		}
		console.log('추가됨');
		// console.log(user);
		callback(err, user);
	});

	// var { id, password, name } = p_arr;

	// var users = database.collection('users');
	// var users_data = [{
	// 	'id': id,
	// 	"password": password,
	// 	"name": name
	// }]

	// users.insertMany(users_data, function (err, result) {
	// 	if (err) {
	// 		callback(err, null);
	// 		return;
	// 	}

	// 	if (result.insertedCount > 0) {
	// 		console.log('레코드 추가됨' + result.insertedCount);
	// 	} else {
	// 		console.log('XXXXXXXXX');
	// 	}
	// 	callback(null, result);
	// })
}

module.exports.init = init;
module.exports.authUser = authUser;
module.exports.addUser = addUser;
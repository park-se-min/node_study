// 기본모듈
var express = require('express');
var http = require('http');
var path = require('path');

// 미들웨어
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
// var errorHandler = require('errorHandler');

// 오류 핸들러
var expressErrorHandler = require('express-error-handler');

// 세션 미들웨어
var expressSession = require('express-session');

// 몽고디비 모듈
var MongoClient = require('mongodb').MongoClient;

// 몽고디비 모듈
var mongoose = require('mongoose');

// DB 변수들
var database;
var UserSchema;
var UserModel;


// 익스프레스 객체생성
var app = express();

// 기본설정
app.set('port', process.env.PORT || 3000);

// body-parser 사용 파싱
app.use(bodyParser.urlencoded({
	extended: false
}));

// json 파싱
app.use(bodyParser.json());

app.use('/', static(path.join(__dirname, '../public')));
// app.use('/uploads', static(path.join(__dirname, '../uploads')));

// cookie 설정
app.use(cookieParser());

// session 설정
app.use(expressSession({
	secret: 'my key',
	resave: true,
	saveUninitialized: true
}));

// 라우터 객체 참조
var router = express.Router();

// DB 커넥트
function connectDB() {
	var databaseUrl = 'mongodb://localhost:27017/local';
	// var databaseUrl = 'mongodb://localhost:27017';

	// DB 연결
	// console.log('연결중');

	mongoose_connect_options = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}

	mongoose.Promise = global.Promise;
	mongoose.connect(databaseUrl, mongoose_connect_options);
	database = mongoose.connection;

	database.on('error', console.error.bind(console, 'mongoose err'));
	database.on('open', function () {
		console.log('DB 연결됨');

		// UserSchema = mongoose.Schema({
		// 	id: String,
		// 	name: String,
		// 	password: String
		// });

		mongoose.set('useCreateIndex', true);

		UserSchema = mongoose.Schema({
			id: {
				type: String,
				required: true,
				unique: true
			},
			password: {
				type: String,
				required: true
			},
			name: {
				type: String,
				index: 'hashed'
			},
			age: {
				type: Number,
				'default': -1
			},
			created_at: {
				type: Date,
				index: {
					unique: false
				},
				'default': Date.now
			},
			updated_at: {
				type: Date,
				index: {
					unique: false
				},
				'default': Date.now
			}
		});


		UserSchema.static('findById', function (id, callback) {
			return this.find({
				id: id
			}, callback);
		});

		UserSchema.static('findAll', function (callback) {
			return this.find({}, callback);
		});

		console.log('schema');

		UserModel = mongoose.model('users2', UserSchema);
		// console.log('model');
	});

	database.on('disconnected', function () {
		console.log('DB 연결끊어짐');
		setInterval(connectDB, 5000);
	});

	// // MongoClient.connect(databaseUrl, function (err, db) {
	// useUnifiedTopology_str = {
	// 	useUnifiedTopology: true
	// }
	// MongoClient.connect(databaseUrl, useUnifiedTopology_str, function (err, db) {
	// 	if (err) throw err;

	// 	console.log('DB 연결됨');

	// 	database = db.db('local');
	// })
}



/*
// 사용자 인증함수
var authUser = function (database, id, password, callback) {
	console.log('authUser');

	var users = database.collection('users');
	var users_data = {
		'id': id,
		"password": password
	}

	users.find(users_data).toArray(function (err, docs) {
		if (err) {
			callback(err, null);
			return;
		}

		if (docs.length > 0) {
			console.log('아이디 %s, 비밀번호 %s', id, password);
			callback(null, docs);
		} else {
			console.log('XXXXXXXXX');
			callback(null, null);
		}
	})
}
 */
var authUser = function (database, p_arr, callback) {
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
	// console.log(users_data);
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
var addUser = function (database, p_arr, callback) {
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


// 로그인
router.route('/process/login').post(function (req, res) {
	console.log('');
	console.log('/process/login');
});

// 로그인
app.post('/process/login', function (req, res) {
	console.log('/process/login');

	var p_id = req.param('id');
	var p_pw = req.param('password');

	var p_arr = {
		'id': p_id,
		'password': p_pw
	}

	if (database) {
		authUser(database, p_arr, function (err, docs) {
			if (err) throw err;

			if (docs) {
				console.log(docs);
				var username = docs[0].name;

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>아이디 : ' + p_id);
				res.write('<br>이름 : ' + username);
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>실패 ');
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();
			}
		})
	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf8'
		});
		res.write('<br>DB 연결실패 ');
		res.end();
	}
})


router.route('/process/adduser').post(function (req, res) {
	// 회원가입
	console.log('/process/adduser');

	var p_id = req.body.id || req.query.id;
	var p_pw = req.body.password || req.query.password;
	var p_name = req.body.name || req.query.name;

	var p_arr = {
		'id': p_id,
		'password': p_pw,
		'name': p_name
	}

	if (database) {
		// addUser(database, p_id, p_pw, p_name, function (err, result) {
		addUser(database, p_arr, function (err, result) {
			if (err) throw err;

			if (result) {
				console.log(result);

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>추가 성공 ');
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>실패 ');
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();
			}
		})
	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf8'
		});
		res.write('<br>DB 연결실패 ');
		res.end();
	}
})

router.route('/process/listuser').post(function (req, res) {
	console.log('/process/listuser');

	if (database){
		UserModel.findAll(function(err, results){
			if (err) {
				console.log('사용자 리스트 오류');

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>사용자 리스트 조회 오류 ');
				res.end();

				return;
			}

			if (results){
				console.dir(results);

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('사용자 리스트');
				res.write('<div><ul>');

				for (let i = 0; i < results.length; i++) {
					var curId = results[i]._doc.id;
					var curName = results[i]._doc.name;
					res.write('<li>#'+ i +' : '+ curId +' : '+ curName +'</li>')
				}

				res.write('</ul></div>');
				res.end();
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('실패 ');
				res.end();
			}
		})
	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf8'
		});
		res.write('<br>DB 연결실패 ');
		res.end();
	}
})


app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));

	connectDB();
})
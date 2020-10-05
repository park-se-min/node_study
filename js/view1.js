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

// mysql 모듈
var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'node',
	debug: false
})

// crypto 모듈
var crypto = require('crypto');
const {
	table
} = require('console');

// DB 변수들
var database;
var UserSchema;
var UserModel;


// 익스프레스 객체생성
var app = express();

// 기본설정
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'ejs');


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

		mongoose.set('useCreateIndex', true);

		createUserSchema();

		// doTest();
		// console.log('model');
	});

	database.on('disconnected', function () {
		console.log('DB 연결끊어짐');
		setInterval(connectDB, 5000);
	});
}

function createUserSchema() {
	UserSchema = require('../database/UserSchema').createSchema(mongoose);
	UserModel = mongoose.model('user2', UserSchema);
	// UserModel = mongoose.model('users_module', UserSchema);

	user = require('../routes/UserRoute');
	user.init(database, UserSchema, UserModel);
}




function doTest() {
	var user = new UserModel({
		'info': 'test03 소녀'
	});

	user.save(function (err) {
		if (err) {
			throw err;
		}
		findAll();
	})
}

function findAll() {
	UserModel.find({}, function (err, reuslts) {
		if (err) {
			throw err;
		}
		if (reuslts) {
			console.log('%s : %s ', reuslts[0]._doc.id, reuslts[0]._doc.name)
		}
	})
}






/*---------------------------------------------------------------------------------*/
/*------------------------------------- route -------------------------------------------- */
/*---------------------------------------------------------------------------------*/
router.route('/process/adduser').post(function (req, res) {
	// 회원가입
	console.log('/process/adduser');

	var p_id = req.body.id || req.query.id;
	var p_name = req.body.name || req.query.name;
	// var p_age = req.body.age || req.query.age;
	var p_pw = req.body.password || req.query.password;

	var p_arr = {
		'id': p_id,
		'name': p_name,
		'password': p_pw
	}

	if (database) {
		// addUser(database, p_id, p_pw, p_name, function (err, result) {
		user.addUser(p_arr, function (err, result) {
			if (err) {
				console.error('추가중 오류' + err.stack);

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>실패 ');
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();

				return;
			};

			if (result) {
				console.log(result);

				var isertId = result.id;

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>추가 성공 ');
				res.write('<br>ID : ' + isertId);
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
});

router.route('/process/login').post(function (req, res) {
	console.log('/process/login');

	var p_id = req.param('id');
	var p_pw = req.param('password');

	var p_arr = {
		'id': p_id,
		'password': p_pw
	}

	if (database) {
		user.authUser(p_arr, function (err, rows) {
			if (err) {
				console.error('추가중 오류' + err.stack);

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>실패 ');
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();

				return;
			};

			console.log(rows);

			if (rows) {

				var username = rows[0].name;

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				var content = {userid:p_id, username:username};
				req.app.render('login_success', content, function(err, html){
					if (err){
						console.log('뷰 랜더링중 에러'+ err.stack);

						res.writeHead(200, {
							'Content-Type': 'text/html; charset=utf8'
						});
						res.write('<br>랜더링 실패 ');
						res.write('<br>'+ err.stack);
						res.end();

						return;
					}

					res.end(html);
				})
			} else {
				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>실2패 ');
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
});

/*
router.route('/process/login').post(function (req, res) {
	console.log('/process/login');

	var p_id = req.param('id');
	var p_pw = req.param('password');

	var p_arr = {
		'id': p_id,
		'password': p_pw
	}

	if (database) {
		user.authUser(p_arr, function (err, rows) {
			if (err) {
				console.error('추가중 오류' + err.stack);

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>실패 ');
				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
				res.end();

				return;
			};

			console.log(rows);

			if (rows) {

				var username = rows[0].name;

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
				res.write('<br>실2패 ');
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
});
 */

router.route('/process/listuser').post(function (req, res) {
	console.log('/process/listuser');

	if (database) {
		UserModel.findAll(function (err, results) {
			if (err) {
				console.log('사용자 리스트 오류');

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('<br>사용자 리스트 조회 오류 ');
				res.end();

				return;
			}

			if (results) {
				var content = {results:results};
				req.app.render('list_user', content, function(err, html){
					if (err) {throw err;}

					res.end(html);
				})
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
});

// 로그인
// app.post('/process/login', function (req, res) {
// 	console.log('/process/login');

// 	var p_id = req.param('id');
// 	var p_pw = req.param('password');

// 	var p_arr = {
// 		'id': p_id,
// 		'password': p_pw
// 	}

// 	if (database) {
// 		authUser(database, p_arr, function (err, docs) {
// 			if (err) throw err;

// 			if (docs) {
// 				console.log(docs);
// 				var username = docs[0].name;

// 				res.writeHead(200, {
// 					'Content-Type': 'text/html; charset=utf8'
// 				});
// 				res.write('<br>아이디 : ' + p_id);
// 				res.write('<br>이름 : ' + username);
// 				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
// 				res.end();
// 			} else {
// 				res.writeHead(200, {
// 					'Content-Type': 'text/html; charset=utf8'
// 				});
// 				res.write('<br>실패 ');
// 				res.write('<br>다시 로그인하기 : <a href="/login_mongo.html">gogo</a>');
// 				res.end();
// 			}
// 		})
// 	} else {
// 		res.writeHead(200, {
// 			'Content-Type': 'text/html; charset=utf8'
// 		});
// 		res.write('<br>DB 연결실패 ');
// 		res.end();
// 	}
// })


app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));

	connectDB();
})
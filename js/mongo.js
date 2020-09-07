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
var database;

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
	var databaseUrl = 'mongodb://localhost:27017';

	// MongoClient.connect(databaseUrl, function (err, db) {
	useUnifiedTopology_str = {
		useUnifiedTopology: true
	}
	MongoClient.connect(databaseUrl, useUnifiedTopology_str, function (err, db) {
		if (err) throw err;

		console.log('DB 연결됨');

		database = db.db('local');
	})
}

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

var addUser = function (database, id, password, name, callback) {
	console.log('addUser');

	var users = database.collection('users');
	var users_data = [{
		'id': id,
		"password": password,
		"name": name
	}]

	users.insertMany(users_data, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}

		if (result.insertedCount > 0) {
			console.log('레코드 추가됨'+ result.insertedCount);
		} else {
			console.log('XXXXXXXXX');
		}
		callback(null, result);
	})
}


// 로그인
router.route('/process/login').post(function (req, res) {
	console.log('');
	console.log('/process/login');
});

app.post('/process/login', function (req, res) {
	console.log('/process/login');

	var p_id = req.param('id');
	var p_pw = req.param('password');

	if (database) {
		authUser(database, p_id, p_pw, function (err, docs) {
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
	console.log('/process/adduser');

	var p_id = req.body.id || req.query.id;
	var p_pw = req.body.password || req.query.password;
	var p_name = req.body.name || req.query.name;

	if (database) {
		addUser(database, p_id, p_pw, p_name, function (err, result) {
			if (err) throw err;

			if (result && result.insertedCount > 0) {
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


app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));

	connectDB();
})
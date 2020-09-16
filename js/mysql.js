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
	UserSchema = mongoose.Schema({
		id: {
			type: String,
			required: true,
			unique: true,
			'default': ''
		},
		hashed_password: {
			type: String,
			required: true,
			'default': ''
		},
		salt: {
			type: String,
			required: true
		},
		name: {
			type: String,
			index: 'hashed',
			'default': ''
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

	UserSchema
		.virtual('password')
		.set(function (password) {
			this._password = password;
			this.salt = this.makeSalt();
			this.hashed_password = this.encryptPassword(password);
			console.log('설정함 : %s', this.hashed_password);
		})
		.get(function () {
			return this._password;
		})

	UserSchema.static('findById', function (id, callback) {
		return this.find({
			id: id
		}, callback);
	});

	UserSchema.static('findAll', function (callback) {
		return this.find({}, callback);
	});

	UserSchema.method('encryptPassword', function (plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});

	UserSchema.method('makeSalt', function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});

	UserSchema.method('authenticate', function (plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출 %s -> %S : %S', plainText, this.encryptPassword(plainText, inSalt), hashed_password);

			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출 %s -> %S : %S', plainText, this.encryptPassword(plainText), this.hashed_password);

			return this.encryptPassword(plainText) === hashed_password;
		}
	});

	UserSchema.path('id').validate(function (id) {
		return id.length;
	}, 'id 칼럼의 값');

	UserSchema.path('name').validate(function (name) {
		return name.length;
	}, 'name 칼럼의 값');

	console.log('UserSchema 정의함');

	UserModel = mongoose.model('users5_password', UserSchema);
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
/*------------------------------------- function -------------------------------------------- */
/*---------------------------------------------------------------------------------*/
var addUser = function (p_arr, callback) {
	console.log('addUser 호출');

	var {
		id,
		name,
		age,
		password
	} = p_arr;

	console.log(p_arr);

	var p_param = {
		'id': id,
		'name': name,
		'age': age,
		'password': password
	}

	pool.getConnection(function (err, conn) {
		if (err) {
			if (conn) {
				conn.release();
			}

			callback(err, null);
			return;
		}
		console.log('데이터베이스 스레드 아이디 : ' + conn.threadId);

		var exec = conn.query('insert into users set ?', p_param, function (err, result) {
			conn.release();
			console.log('sql:' + exec.sql);

			if (err) {
				console.log('오류');
				console.dir(err);

				callback(err, null);

				return;
			}

			callback(null, result)
		})
	});
}

var authUser = function (p_arr, callback) {
	console.log('authUser 호출');

	var {
		id,
		password
	} = p_arr;

	pool.getConnection(function (err, conn) {
		if (err) {
			if (conn) {
				conn.release();
			}

			callback(err, null);
			return;
		}
		console.log('데이터베이스 스레드 아이디 : ' + conn.threadId);

		var columns = ['id', 'name', 'age'];
		var tablename = 'users';

		var exec = conn.query('select ?? from ?? where id=? and password=? ', [columns, tablename, id, password], function (err, rows) {
			conn.release();
			console.log('sql:' + exec.sql);

			if (rows.length > 0) {
				console.log('아이디 찾음');

				callback(null, rows);
			} else {
				console.log('XXXXXXXXX');
				callback(null, null);
			}
		})

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
	var p_age = req.body.age || req.query.age;
	var p_pw = req.body.password || req.query.password;

	var p_arr = {
		'id': p_id,
		'name': p_name,
		'age': p_age,
		'password': p_pw
	}

	if (pool) {
		// addUser(database, p_id, p_pw, p_name, function (err, result) {
		addUser(p_arr, function (err, result) {
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

				var isertId = result.insertId;

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

	if (pool) {
		authUser(p_arr, function (err, rows) {
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

			if (rows) {
				console.log(rows);

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
				console.dir(results);

				res.writeHead(200, {
					'Content-Type': 'text/html; charset=utf8'
				});
				res.write('사용자 리스트');
				res.write('<div><ul>');

				for (let i = 0; i < results.length; i++) {
					var curId = results[i]._doc.id;
					var curName = results[i]._doc.name;
					res.write('<li>#' + i + ' : ' + curId + ' : ' + curName + '</li>')
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
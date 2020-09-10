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

		mongoose.set('useCreateIndex', true);

		createUserSchema();

		doTest();
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
			unique: true
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
		.virtual('info')
		.set(function (info) {
			var splitted = info.split(' ');
			this.id = splitted[0];
			this.name = splitted[1];
			console.log('설정함 : %s, %s', this.id, this.name);
		})


	console.log('UserSchema 정의함');

	UserModel = mongoose.model('users4', UserSchema);
}

function doTest() {
	var user = new UserModel({
		'info': 'test01 소녀'
	});

	user.save(function (err) {
		if (err) {
			throw err;
		}
		findAll();
	})
}

function findAll() {
	UserModel.finde({}, function (err, reuslts) {
		if (err) {
			throw err;
		}
		if (reuslts) {
			console.log('%s : %s ', reuslts[0]._doc.id, reuslts[0]._doc.name)
		}
	})
}


app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));

	connectDB();
})
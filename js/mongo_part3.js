// DB 변수들
var database;
var UserSchema;
var UserModel;

// 기본 모듈
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var MongoClient = require('mongodb').MongoClient;

var config = require('./config');
var database = require('../database/database');
var mongoose = require('mongoose');

// crypto 모듈
var crypto = require('crypto');
const {
	table
} = require('console');

// 익스프레스 객체생성
var app = express();

// 기본설정
app.set('port', process.env.PORT || config.server_port);

// body-parser 사용 파싱
app.use(bodyParser.urlencoded({
	extended: false
}));

// json 파싱
app.use(bodyParser.json());

app.use('/', static(path.join(__dirname, '../public')));

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
	database.init(app, config);
}


app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));

	connectDB();
})
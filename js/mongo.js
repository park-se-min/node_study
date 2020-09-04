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

// 익스프레스 객체생성
var app = express();

// 기본설정
app.set('port', process.env.PORT || 3000);

// body-parser 사용 파싱
app.use(bodyParser.urlencoded({ extended: false }));

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



// 로그인
router.route('/process/login').post(function (req, res) {
	console.log('');
	console.log('/process/login');

	// var p_id = req.body.id || req.query.id;
	// var p_pw = req.body.password || req.query.password;

	// if (req.session.user) {
	// 	res.redirect('/product.html');
	// } else {
	// 	req.session.user = {
	// 		id: p_id,
	// 		name: '박',
	// 		authorized: true,
	// 	};

	// 	res.writeHead(200, {
	// 		'Content-Type': 'text/html; charser=utf8'
	// 	});
	// 	res.write('<br>paramId : ' + p_id);
	// 	res.write('<br>product : <a href="/product.html">gogo</a>');
	// 	res.end();
	// }

});



app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));
})
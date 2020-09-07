// 기본모듈
var express = require('express');
var http = require('http');
var path = require('path');

// 미들웨어
var bodyParser = require('body-parser');
var static = require('serve-static');

var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 익스프레스 객체
var app = express();

// 라우터 객체 참조
var router = express.Router();

// 기본설정
app.set('port', process.env.PORT || 3000);

// body-parser 사용 파싱
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bodyParser.json());

app.use('/', static(path.join(__dirname, '../public')));

app.use(cookieParser());
app.use(expressSession({
	secret: 'my key',
	resave: true,
	saveUninitialized: true
}));


// 세션
router.route('/process/product').get(function (req, res) {
	console.log('');
	console.log('/process/product');

	if (req.session.user) {
		res.redirect('/product.html');
	} else {
		res.redirect('/login2.html');
	}
});

// 로그인
router.route('/process/login').post(function (req, res) {
	console.log('');
	console.log('/process/login');

	var p_id = req.body.id || req.query.id;
	var p_pw = req.body.password || req.query.password;

	if (req.session.user) {
		res.redirect('/product.html');
	} else {
		req.session.user = {
			id: p_id,
			name: '박',
			authorized: true,
		};

		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf8'
		});
		res.write('<br>paramId : ' + p_id);
		res.write('<br>product : <a href="/product.html">gogo</a>');
		res.end();
	}
});

// 로그아웃
router.route('/process/logout').get(function (req, res) {
	console.log('');
	console.log('/process/logout');

	console.log('/process/logout 호출됨');

	if (req.session.user) {
		console.log('로그아웃합니다.');
		req.session.destroy(function (err) {
			if (err) {
				throw err;
			}
			console.log('세션을 삭제하고 로그아웃되었습니다');
			res.redirect('/login2.html');
		});
	} else {
		console.log('아직 로그인되어 있지 않습니다.');
		res.redirect('/login2.html');
	}
});


app.use('/', router);



http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));
})
// 기본모듈
var express = require('express');
var http = require('http');
var path = require('path');

// 미들웨어
var bodyParser = require('body-parser');
var static = require('serve-static');

var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');

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

// 라우터
// router.route('/process/login').get();
router.route('/process/login').post(function (req, res) {
	console.log('');
	console.log('post');

	var p_id = req.body.id || req.query.id;
	var p_pw = req.body.password || req.query.password;

	res.writeHead(200, {
		'Content-Type': 'text/html; charser=utf8'
	});
	res.write('<br>id' + p_id);
	res.write('<br>pw' + p_pw);
	res.end();
});

//url 파라미터
router.route('/process/login/:name/:asdf').post(function (req, res) {
	console.log('');
	console.log('/process/login/:name 처리함');

	var paramName = req.params.name;
	var paramName2 = req.params.asdf;

	var p_id = req.body.id || req.query.id;
	var p_pw = req.body.password || req.query.password;

	res.writeHead(200, {
		'Content-Type': 'text/html; charser=utf8'
	});
	res.write('<br>id : ' + p_id);
	res.write('<br>pw : ' + p_pw);
	res.write('<br>paramName : ' + paramName);
	res.write('<br>paramName2 : ' + paramName2);
	res.end();
});


//url 파라미터
router.route('/process/user/:id').get(function (req, res) {
	console.log('');
	console.log('/process/user/:id 처리함');

	var paramId = req.params.id;

	console.log('/process/user/:id %s', paramId);

	res.writeHead(200, {
		'Content-Type': 'text/html; charser=utf8'
	});
	res.write('<br>paramId : ' + paramId);
	res.end();
});

//쿠키
router.route('/process/showCookie').get(function (req, res) {
	console.log('');
	console.log('/process/showCookie');

	res.send(req.cookies);
	res.end();
});

// 쿠키
router.route('/process/setUserCookie').get(function (req, res) {
	console.log('');
	console.log('/process/setUserCookie');

	res.cookie('user', {
		id: 'park',
		name: 'a',
		authorized: true
	});

	res.redirect('/process/showCookie');
});

// app.all('*', function(req, res){
// 	res.status(404).send('<h1>페이지 ㄴㄴ</h1>');
// });

// var errorHandler = expressErrorHandler({
// 	static:{
// 		'404':'./public/404.html'
// 	}
// })
// app.use(expressErrorHandler.httpError(404));
// app.use(errorHandler);

app.use('/', router);



http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));
})
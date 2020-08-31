// 기본모듈
var express = require('express');
var http = require('http');
var path = require('path');

// 미들웨어
var bodyParser = require('body-parser');
var static = require('serve-static');

// 익스프레스 객체
var app = express();

// 기본설정
app.set('port', process.env.PORT || 3000);

// body-parser 사용 파싱
app.use(bodyParser.urlencoded({ extended : false }));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, '../public')));


// 1
app.use(function (req, res, next) {
	console.log('');
	console.log('1');

	var p_id = req.body.id || req.query.id;
	var p_pw = req.body.password || req.query.password;

	res.writeHead(200, {'Content-Type':'text/html; charser=utf8'});
	res.write('<br>id'+ p_id);
	res.write('<br>pw'+ p_pw);
	res.end();
})


http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));
})
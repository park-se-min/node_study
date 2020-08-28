var express = require('express');
var http = require('http');
var path = require('path');
var static = require('serve-static');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use('/public', static(path.join(__dirname, 'public')));

/*
// 1
app.use(function (req, res, next) {
	console.log('');
	console.log('1');

	var userAgent = req.header('User-Agent');
	var paramName = req.query.name;


	console.log(userAgent);
	console.log(paramName);

	// res.sendStatus('403');

	// res.send({
	// 	name: '소녀',
	// 	age: 20
	// });

	// req.user = 'ddd';

	// next();

	res.end();
})
 */
// // 2
// app.use('/', function (req, res, next) {
// 	console.log('2');

// 	res.writeHead('200', {
// 		'content-type': 'text/html;charset=utf8'
// 	});
// 	res.end('end' + req.user);
// 	console.log('---');
// })



http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));
})
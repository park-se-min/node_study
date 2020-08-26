var express = require('express');
var http = require('http');

var server = http.createServer();
var port = 3000;

server.listen(port, function () {
	console.log('시작; %d', port);
});

server.on('connection', function (socket) {
	var addr = socket.address();
	console.log('%s, %d', addr.address, addr.port);
});

server.on('request', function (req, res) {
	console.log('요청옴');
	// console.dir(req);
	res.writeHead(200, {"content-type":"text/html;charset=utf-8;"});
	res.write('<!DOCTYPE html>');
	res.write('<html lang="en">');
	res.write('<head>');
	res.write('	<meta charset="UTF-8">');
	res.write('	<title>Document</title>');
	res.write('</head>');
	res.write('<body>');
	res.write('	11111111111111111');
	res.write('</body>');
	res.write('</html>');
	res.end();
});

server.on('close', function () {
	console.log('종료');
});
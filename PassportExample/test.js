var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.set('port', 8080);

http.createServer(app).listen(8080, function(){
	console.log(1);
})

// var server = http.createServer();

// var port = 8080;

// server.listen(port)

// server.on('request', function(req, res){
// 	res.write('test');
// 	res.end();
// })
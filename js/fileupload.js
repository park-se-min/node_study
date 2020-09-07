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

// 파일 업로드
var multer = require('multer');
var fs = require('fs');

// 클라 ajax 요청시 CORS (다중서버 접속) 지원
var cors = require('cors');

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
app.use('/uploads', static(path.join(__dirname, '../uploads')));

app.use(cookieParser());
app.use(expressSession({
	secret: 'my key',
	resave: true,
	saveUninitialized: true
}));

app.use(cors());



/* **** 중요 **** 미들웨어 순서도 중요. body > multer > router */
// 파일 제한 10개, 1G
var storageStr = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads')
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + '_' + file.originalname)
	}
});

var upload = multer({
	storage: storageStr,
	limits: {
		files: 10,
		fileSize: 1024 * 1024 * 1024
	}
})

var router = express.Router();







router.route('/process/photo').post(upload.array('photo', 10), function (req, res) {
	console.log('');
	console.log('/process/photo');

	try {
		var files = req.files;

		console.dir('SSSSSSSSSSSSSSSSSSSSSSSS');
		console.dir(req.files);
		console.dir('EEEEEEEEEEEEEEEEEEEEEEEE');

		var originalname = '',
			filename = '',
			mimetype = '',
			size = 0;

		if (Array.isArray(files)) {
			console.log('배열 %d', files.length);

			for (let index = 0; index < files.length; index++) {
				originalname = files[index].originalname;
				filename = files[index].filename;
				mimetype = files[index].mimetype;
				size = files[index].si;
			}
		} else {
			console.log('파일갯수 1');

			originalname = files[index].originalname;
			filename = files[index].filename;
			mimetype = files[index].mimetype;
			size = files[index].si;
		}


		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf8'
		});
		res.write('<br>originalname : ' + originalname);
		res.write('<br>filename : ' + filename);
		res.write('<br>mimetype : ' + mimetype);
		res.write('<br>size : ' + size);
		res.end();
	} catch (err) {
		console.dir(err.stack);
	}
});









app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
	console.log('익스프레스 ' + app.get('port'));
})
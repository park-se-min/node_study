var mongoose = require('mongoose');

var database = {};

database.init = function(app, config){
	console.log('db init 실행');

	connect(app, config);
}

function connect(app, config){
	var databaseUrl = config.db_url;

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

		createSchema();

		// doTest();
		// console.log('model');
	});

	database.on('disconnected', function () {
		console.log('DB 연결끊어짐');
		connect(app, config);
		// setInterval(connectDB, 5000);
	});
}

function createSchema(app, config){
	var schemaLen = config.db_schemas.length;
	console.log('스키마수 %s', schemaLen);

	for (let i = 0; i < schemaLen; i++) {
		var curItem = config.db_schemas[i];

		var curSchema = require(curItem.file).createSchema(mongoose);

		var curModel = mongoose.model(curItem.collection, curSchema);

		database[curItem.schemaName] = curSchema;
		database[curItem.modelName] = curModel;
	}

	app.set('database', database);
	console.log('database 객체 app 객체의 속성추가');
}

module.exports = database;
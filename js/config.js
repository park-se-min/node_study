module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [{
		file: '../database/UserSchema',
		collection: 'user2',
		schemaName: 'UserSchema',
		modelName: 'UserModel'
	}]
}
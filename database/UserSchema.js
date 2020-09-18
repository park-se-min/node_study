// crypto 모듈
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function (mongoose) {

	mongoose.set('useCreateIndex', true);

	UserSchema = mongoose.Schema({
		age: {
			type: Number,
			'default': -1
		},
		id: {
			type: String,
			required: true,
			unique: true,
			'default': ''
		},
		password: {
			type: String,
			required: true
		},
		name: {
			type: String,
			index: 'hashed',
			'default': ''
		},
		created_at: {
			type: Date,
			index: {
				unique: false
			},
			'default': Date.now
		},
		updated_at: {
			type: Date,
			index: {
				unique: false
			},
			'default': Date.now
		}
	});

	// UserSchema
	// 	.virtual('password')
	// 	.set(function (password) {
	// 		this._password = password;
	// 		this.salt = this.makeSalt();
	// 		this.hashed_password = this.encryptPassword(password);
	// 		console.log('설정함 : %s', this.hashed_password);
	// 	})
	// 	.get(function () {
	// 		return this._password;
	// 	})

	UserSchema.static('findById', function (id, callback) {
		// console.log(UserSchema.find({id: id}));
		return this.find({
			id: id
		}, callback);
	});

	UserSchema.static('findAll', function (callback) {
		return this.find({}, callback);
	});

	UserSchema.method('encryptPassword', function (plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});

	UserSchema.method('makeSalt', function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});

	UserSchema.method('authenticate', function (plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출 %s -> %S : %S', plainText, this.encryptPassword(plainText, inSalt), hashed_password);

			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출 %s -> %S : %S', plainText, this.encryptPassword(plainText), this.hashed_password);

			return this.encryptPassword(plainText) === hashed_password;
		}
	});

	UserSchema.path('id').validate(function (id) {
		return id.length;
	}, 'id 칼럼의 값');

	UserSchema.path('name').validate(function (name) {
		return name.length;
	}, 'name 칼럼의 값');

	console.log('UserSchema 정의함');

	return UserSchema;
};

module.exports = Schema;
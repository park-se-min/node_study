function User(p_arr) {
	var {
		id,
		name
	} = p_arr

	this.id = id;
	this.name = name;
}

User.prototype.getUser = function () {
	return {
		id: this.id,
		name: this.name
	};
}

User.prototype.group = {
	id: 'ggg',
	name: '친구'
};

User.prototype.printUser = function () {
	console.log('%s : %s', this.id, this.name);
}

var p_arr = {
	'id': 'test',
	'name': '소녀'
}

User.prototype.value_update = function (p_arr) {
	var {
		id,
		name
	} = p_arr

	this.id = id;
	this.name = name;
}

module.exports = new User(p_arr);
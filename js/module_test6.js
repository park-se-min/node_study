var require = function(path)
{
	var exports = {
		getUser: function () {
			return {
				id: 'test1',
				name: '소녀'
			};
		},
		group: {
			id: 'g',
			name: '친구'
		}
	}

	return exports;
}

var user = require('...');


function a() {
	// return user().name + ' + ' + user().id;
	return user.getUser().name + ' + ' + user.group.id;
	// return user.getUser('adlkjsd').bbb + ' + ' + user.group.id;
}

console.log(a());

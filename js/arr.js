var user = [
	{
		age : 20,
		name : '소녀'
	},
	{
		age : 22,
		name : '걸걸'
	},
	{
		age : 23,
		name : '걸걸'
	},
	{
		age : 24,
		name : '걸걸'
	},
	{
		age : 25,
		name : '걸걸'
	},
	{
		age : 26,
		name : '걸걸'
	}
];

var add = function(a, b) {
	return a + b;
}

// user.push(add);

console.log(user.length);
user.splice(0, 0, {a:1212});

console.log(user.length);
console.log(user[0].a);
console.log(user[1].age);
// console.log(user[2](1,5));
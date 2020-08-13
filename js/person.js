var person = {
	age : 20,
	name : '소녀시대',
	add : function(a, b) {
		return a + b;
	}
};

console.log(person.name);
console.log('더하기 : %d', person.add(3, 7));
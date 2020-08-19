function Person(n, a) {
	this.name = n;
	this.age = a;
}

Person.prototype.walk = function (s) {
	console.log(s + 'km 속도');
}

var person01 = new Person('aaa', 20);
var person02 = new Person('bbb', 22);

console.log(person01.name + '호출');
person01.walk(10);
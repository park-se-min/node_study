function add(a, b, callback) {
	var r = a + b;
	callback(r);

	var c = 0
	var hi = function(){
		c++;
		return c +':'+ a + '+' + b + '=' + r;
	};
	return hi;
}

var add_hi = add(5, 10, function(rr){
	console.log(rr);
})

add_hi();
console.log('aaa:'+ add_hi());
console.log('aaa:'+ add_hi());
console.log('aaa:'+ add_hi());
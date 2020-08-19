/*
function add(a, b, callback) {
	var r = a + b;
	callback(r);
}

console.log('s');
add(1, 5, function (rrr) {
	for (let i = 0; i < 100000000; i++) {
	}
	console.log('콜백');
	console.log('더하기 %d', rrr);
})
console.log('e');
 */

function add2(a, b, callback) {
	var r = a + b;
	callback(r);

	var c = 0;
	var history = function() {
		c++;
		return c + ' : ' + a +' + '+ b +' = '+ r;
	}

	var c = 1; // ??
	var history2 = function() {
		c--;
		return c + ' : ' + a +' + '+ b +' = '+ r;
	}

	if (a == "1")
		return history;
	else
		return history2;
}

var add2_history = add2(1, 5, function(r){
	console.log('콜백');
	console.log('더하기 %d', r);
});

var add2_history2 = add2(2, 5, function(r){
	console.log('콜백');
	console.log('더하기 %d', r);
});


console.log('결과 '+ add2_history());
console.log('결과 '+ add2_history());
console.log('결과 '+ add2_history());
console.log('결과 '+ add2_history());
console.log('결과 '+ add2_history2());
console.log('결과 '+ add2_history());
console.log('결과 '+ add2_history2());
console.log('결과 '+ add2_history());
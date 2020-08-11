//// 01
var result = 0;
for (let i = 0; i <= 1000; i++) {
	result += i;
}

// console.timeEnd('duration_sum');
console.log('결과물 : %d', result);
console.log('결과물 : %s', __filename);

//// 02
console.log('argv : '+ process.argv.length);
console.log('----------');


console.log(process.argv);
console.log('----------');


if (process.argv.length > 2) {
	console.log(process.argv.length +' : %s', process.argv[2]);
}
console.log('----------');


process.argv.forEach(function(item, index) {
	console.log(index + ':', item);
});



//// 03
console.log(process.env);
console.log('os : '+ process.env['OS']);
process.on('exit', function(){
	console.log('exit--');
});

setTimeout(function(){
	console.log('2초');

	process.exit();
}, 2000);
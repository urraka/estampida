kEpsilon = 0.00001;

function assert(condition, message) {
	if (!condition) {
		console.log(message);
	}
}

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

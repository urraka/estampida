function Vector2(x, y) {
	if (x instanceof Vector2) {
		this.x = x.x;
		this.y = x.y;
	}
	else {
		this.x = x || 0;
		this.y = y || 0;
	}
}

Vector2.prototype.equals = function(b) {
	return this.x === b.x && this.y === b.y;
}

Vector2.prototype.assign = function(b) {
	this.x = b.x;
	this.y = b.y;
	
	return this;
}

Vector2.prototype.add = function(b) {
	this.x += b.x;
	this.y += b.y;
	
	return this;
}

Vector2.prototype.subtract = function(b) {
	this.x -= b.x;
	this.y -= b.y;
	
	return this;
}

Vector2.prototype.multiply = function(scalar) {
	this.x *= scalar;
	this.y *= scalar;

	return this;
}

// static methods

Vector2.add = function(a, b) {
	return new Vector2(a.x, a.y).add(b);
}

Vector2.subtract = function(a, b) {
	return new Vector2(a.x, a.y).subtract(b);
}

Vector2.multiply = function(a, scalar) {
	return new Vector2(a.x, a.y).multiply(scalar);
}

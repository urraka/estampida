/**
 * - void Vector2(double x, double y)
 * - void Vector2(Vector2 vector)
 */
function Vector2(x, y) {
	this.assign(x, y);
}

Vector2.prototype.equals = function(vector) {
	return this.x === vector.x && this.y === vector.y;
}

/**
 * - void assign(double x, double y)
 * - void assign(Vector2 vector)
 */
Vector2.prototype.assign = function(x, y) {
	if (x instanceof Vector2) {
		var vector = x;
		this.x = vector.x;
		this.y = vector.y;
	}
	else {
		this.x = x || 0;
		this.y = y || 0;
	}
	
	return this;
}

/**
 * - void add(double x, double y)
 * - void add(Vector2 vector)
 */
Vector2.prototype.add = function(x, y) {
	if (x instanceof Vector2) {
		var vector = x;
		this.x += vector.x;
		this.y += vector.y;
	}
	else {
		this.x += x;
		this.y += y;
	}
	
	return this;
}

/**
 * - void subtract(double x, double y)
 * - void subtract(Vector2 vector)
 */
Vector2.prototype.subtract = function(x, y) {
	if (x instanceof Vector2) {
		var vector = x;
		this.x -= vector.x;
		this.y -= vector.y;
	}
	else {
		this.x -= x;
		this.y -= y;
	}
	
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
	return new Vector2(a).subtract(b);
}

Vector2.multiply = function(a, scalar) {
	return new Vector2(a).multiply(scalar);
}

/**
 * - void Vector2(double x, double y)
 * - void Vector2(Vector2 vector)
 */
function Vector2(x, y) {
	this.assign(x || 0, y || 0);
}

Vector2.prototype.coord = function(which) {
	return (which === "x" ? this.x : this.y);
}

Vector2.prototype.assignCoord = function(which, value) {
	which === "x" ? this.x = value : this.y = value;
	return value;
}

/**
 * - void equals(double x, double y)
 * - void equals(Vector2 vector)
 */
Vector2.prototype.equals = function(x, y) {
	if (x instanceof Vector2)
		return this.equalsVector(x);
	else
		return this.equalsxy(x, y);
}

Vector2.prototype.equalsVector = function(vector) {
	return this.x === vector.x && this.y === vector.y;
}

Vector2.prototype.equalsxy = function(x, y) {
	return this.x === x && this.y === y;
}

/**
 * - void assign(double x, double y)
 * - void assign(Vector2 vector)
 */
Vector2.prototype.assign = function(x, y) {
	if (x instanceof Vector2)
		return this.assignVector(x);
	else
		return this.assignxy(x, y);
}

Vector2.prototype.assignVector = function(vector) {
	this.x = vector.x;
	this.y = vector.y;
	return this;
}

Vector2.prototype.assignxy = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
}

/**
 * - void add(double x, double y)
 * - void add(Vector2 vector)
 */
Vector2.prototype.add = function(x, y) {
	if (x instanceof Vector2)
		return this.addVector(x);
	else
		return this.addxy(x, y);
}

Vector2.prototype.addVector = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
	return this;
}

Vector2.prototype.addxy = function(x, y) {
	this.x += x;
	this.y += y;
	return this;
}

/**
 * - void subtract(double x, double y)
 * - void subtract(Vector2 vector)
 */
Vector2.prototype.subtract = function(x, y) {
	if (x instanceof Vector2)
		return this.subtractVector(x);
	else
		return this.subtractxy(x, y);
}

Vector2.prototype.subtractVector = function(vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	return this;
}

Vector2.prototype.subtractxy = function(x, y) {
	this.x -= x;
	this.y -= y;
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

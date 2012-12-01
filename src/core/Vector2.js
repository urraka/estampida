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
		return this.equalsv(x);
	else
		return this.equalsxy(x, y);
}

Vector2.prototype.equalsv = function(vector) {
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
		return this.assignv(x);
	else
		return this.assignxy(x, y);
}

Vector2.prototype.assignv = function(vector) {
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
		return this.addv(x);
	else
		return this.addxy(x, y);
}

Vector2.prototype.addv = function(vector) {
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
		return this.subtractv(x);
	else
		return this.subtractxy(x, y);
}

Vector2.prototype.subtractv = function(vector) {
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

Vector2.prototype.magnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector2.prototype.normalize = function() {
	var mag = this.magnitude();
	return this.assignxy(this.x / mag, this.y / mag);
}

Vector2.prototype.dot = function(x, y) {
	if (x instanceof Vector2)
		return this.dotv(x);
	else
		return this.dotxy(x, y);
}

Vector2.prototype.dotv = function(vector) {
	return this.x * vector.x + this.y * vector.y;
}

Vector2.prototype.dotxy = function(x, y) {
	return this.x * x + this.y * y;
}

// assumes the vector is normalized
Vector2.prototype.angle = function() {
	var angle = Math.asin(this.y);

	if (this.x < 0 && this.y >= 0)
		angle = Math.PI - angle;
	else if (this.x <= 0 && this.y < 0)
		angle = Math.PI + Math.abs(angle);
	else if (this.x > 0 && this.y < 0)
		angle = Math.PI * 2 - Math.abs(angle);

	return angle;
}
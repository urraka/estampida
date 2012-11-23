/**
 * - void Rectangle(double left, double top, double width, double height)
 * - void Rectangle(Rectangle rc)
 */
function Rectangle(left, top, width, height) {
	this.assign(left, top, width, height);
}

/**
 * - void assign(double left, double top, double width, double height)
 * - void assign(Rectangle rc)
 */
Rectangle.prototype.assign = function(left, top, width, height) {
	if (left instanceof Rectangle) {
		var rc = left;
		this.left = rc.left;
		this.top = rc.top;
		this.width = rc.width;
		this.height = rc.height;
	}
	else {
		this.left = left || 0;
		this.top = top || 0;
		this.width = width || 0;
		this.height = height || 0;
	}

	return this;
}

Rectangle.prototype.intersects = function(rc) {
	if (this.left < rc.left + rc.width   &&
		this.left + this.width > rc.left &&
		this.top < rc.top + rc.height    &&
		this.top + this.height > rc.top) {
		return true;
	}

	return false;
}

Rectangle.prototype.expand = function(rc) {
	var right = Math.max(this.left + this.width, rc.left + rc.width);
	var bottom = Math.max(this.top + this.height, rc.top + rc.height);

	this.left = Math.min(this.left, rc.left);
	this.top = Math.min(this.top, rc.top);

	this.width = right - this.left;
	this.height = bottom - this.top;

	return this;
}

Rectangle.prototype.containsxy = function(x, y) {
	return x >= this.left &&
           x <= this.left + this.width &&
           y >= this.top &&
           y <= this.top + this.height;
}
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

Rectangle.prototype.intersectsLine = function(p1, p2) {
    var minX = p1.x;
    var maxX = p2.x;
    
    if (p1.x > p2.x) {
        minX = p2.x;
        maxX = p1.x;
    }
    
    if (maxX > this.left + this.width)
        maxX = this.left + this.width;
    
    if (minX < this.left)
        minX = this.left;
    
    if (minX > maxX)
        return false;
    
    var minY = p1.y;
    var maxY = p2.y;
    
    var dx = p2.x - p1.x;
    
    if (Math.abs(dx) > kEpsilon) {
        var a = (p2.y - p1.y) / dx;
        var b = p1.y - a * p1.x;
        minY = a * minX + b;
        maxY = a * maxX + b;
    }
    
    if (minY > maxY) {
        var tmp = maxY;
        maxY = minY;
        minY = tmp;
    }
    
    if (maxY > this.top + this.height)
        maxY = this.top + this.height;
    
    if (minY < this.top)
        minY = this.top;
    
    if (minY > maxY)
        return false;
    
    return true;
}

function Rectangle(left, top, width, height) {
	if (left instanceof Rectangle) {
		this.left = left.left;
		this.top = left.top;
		this.width = left.width;
		this.height = left.height;
	}
	else {
		this.left = left || 0;
		this.top = top || 0;
		this.width = width || 0;
		this.height = height || 0;
	}
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

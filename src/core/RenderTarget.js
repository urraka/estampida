function RenderTarget() {
	this.isCreated_ = false;
	this.canvas_ = null;
	this.context_ = null;
}

/**
 * - void create()
 * - void create(double width, double height)
 */
RenderTarget.prototype.create = function(width, height) {
	this.canvas_ = document.createElement("canvas");
	this.context_ = this.canvas_.getContext("2d");
	this.isCreated_ = true;

	if (width && height) {
		this.setSize(width, height);
	}
}

/**
 * - void getSize(Vector2 &size)
 * - Vector2 getSize()
 */
RenderTarget.prototype.getSize = function(size) {
	if (size && size instanceof Vector2) {
		size.x = this.canvas_.width;
		size.y = this.canvas_.height;
	}
	else {
		return new Vector2(this.canvas_.width, this.canvas_. height);
	}
}

/**
 * - void setSize(Vector2 size)
 * - void setSize(double width, double height)
 */
RenderTarget.prototype.setSize = function(width, height) {
	if (width instanceof Vector2) {
		var size = width;
		this.canvas_.width = size.x;
		this.canvas_.height = size.y;
	}
	else {
		this.canvas_.width = width;
		this.canvas_.height = height;
	}
}

RenderTarget.prototype.getCanvas = function() {
	return this.canvas_;
}

RenderTarget.prototype.getContext = function() {
	return this.context_;
}

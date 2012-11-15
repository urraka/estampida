function RenderTarget() {
	this.isCreated_ = false;
	this.canvas_ = null;
	this.context_ = null;
}

RenderTarget.prototype.create = function() {
	this.canvas_ = document.createElement("canvas");
	this.context_ = this.canvas_.getContext("2d");
	this.isCreated_ = true;
}

RenderTarget.prototype.getSize = function() {
	return new Vector2(this.canvas_.width, this.canvas_. height);
}

RenderTarget.prototype.setSize = function(size) {
	this.canvas_.width = size.x;
	this.canvas_.height = size.y;
}

RenderTarget.prototype.getCanvas = function() {
	return this.canvas_;
}

RenderTarget.prototype.getContext = function() {
	return this.context_;
}

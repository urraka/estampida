function RenderWindow() {
	this.isCreated_ = false;
	this.currentSize_ = null;
	this.front_ = new RenderTarget();
	this.back_ = new RenderTarget();
}

RenderWindow.prototype.create = function(element) {
	this.front_.create();
	this.back_.create();

	$(this.front_.getCanvas()).css({
		display: "block",
		width: "100%",
		height: "100%"
	});

	$(element).append(this.front_.getCanvas());

	this.currentSize_ = this.getSize();
	this.isCreated_ = true;
}

RenderWindow.prototype.setLogicalSize = function(size) {
	this.front_.setSize(size);
	this.back_.setSize(size);
}

RenderWindow.prototype.getLogicalSize = function() {
	return this.front_.getSize();
}

RenderWindow.prototype.getSize = function() {
	var $canvas = $(this.front_.getCanvas());
	return new Vector2($canvas.width(), $canvas.height());
}

RenderWindow.prototype.onResize = function(resizeCallback, owner) {
	var self = this;

	$(window).resize(function() {
		var sz = self.getSize();
		if (!self.currentSize_.equals(sz)) {
			self.currentSize_.assign(sz);
			resizeCallback.call(owner, sz);
		}
	});
}

RenderWindow.prototype.getContext = function() {
	return this.back_.getContext();
}

RenderWindow.prototype.display = function() {
	this.front_.getContext().drawImage(this.back_.getCanvas(), 0, 0)
}

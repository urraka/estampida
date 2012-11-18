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

/**
 * - void getLogicalSize(Vector2 &size)
 * - Vector2 getLogicalSize()
 */
RenderWindow.prototype.getLogicalSize = function(size) {
	if (size && size instanceof Vector2) {
		this.front_.getSize(size);
	}
	else {
		return this.front_.getSize();
	}
}

/**
 * - void getSize(Vector2 &size)
 * - Vector2 getSize()
 */
RenderWindow.prototype.getSize = function(size) {
	var $canvas = $(this.front_.getCanvas());

	if (size && size instanceof Vector2) {
		size.x = $canvas.width();
		size.y = $canvas.height();
	}
	else {
		return new Vector2($canvas.width(), $canvas.height());
	}
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
	this.front_.getContext().drawImage(this.back_.getCanvas(), 0, 0);
}

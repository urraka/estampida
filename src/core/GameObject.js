function GameObject() {
	this.position_ = new Vector2();
	this.previousPosition_ = new Vector2();
	this.drawPosition_ = new Vector2();
	this.velocity_ = new Vector2();
	this.origin_ = new Vector2();
	this.image_ = null;
	this.animation_ = new Animation();
	this.clipRect_ = new Rectangle();
	this.flipX_ = false;
	this.flipY_ = false;
}

GameObject.prototype.interpolate = function(alpha) {
	this.drawPosition_.x = Math.floor(this.position_.x * alpha + this.previousPosition_.x * (1 - alpha));
	this.drawPosition_.y = Math.floor(this.position_.y * alpha + this.previousPosition_.y * (1 - alpha));
}

GameObject.prototype.draw = function(context) {
	context.save();
	context.translate(this.drawPosition_.x, this.drawPosition_.y);
	context.scale(this.flipX_ === true ? -1 : 1, this.flipY_ === true ? -1 : 1);

	if (this.clipRect_.width > 0 && this.clipRect_.height > 0) {
		context.drawImage(this.image_, this.clipRect_.left, this.clipRect_.top, this.clipRect_.width, this.clipRect_.height, -this.origin_.x, -this.origin_.y, this.clipRect_.width, this.clipRect_.height);
	}
	else {
		context.drawImage(this.image_, -this.origin_.x, -this.origin_.y, this.image_.width, this.image_.height);
	}
	
	context.restore();
}

GameObject.prototype.getPosition = function() {
	return this.position_;
}

GameObject.prototype.getVelocity = function() {
	return this.position_;
}

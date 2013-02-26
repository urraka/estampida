function GameObject() {
	this.position_ = new Vector2();
	this.previousPosition_ = new Vector2();
	this.drawPosition_ = new Vector2();

	this.rotation_ = 0;
	this.previousRotation_ = 0;
	this.drawRotation_ = 0;

	this.velocity_ = new Vector2();

	this.origin_ = new Vector2();
	this.image_ = null;
	this.animation_ = new Animation();
	this.clipRect_ = new Rectangle();
	this.flipX_ = false;
	this.flipY_ = false;
}

GameObject.prototype.interpolate = function(alpha) {
	/*this.drawPosition_.x = Math.floor(this.position_.x);
	this.drawPosition_.y = Math.floor(this.position_.y);

	if (Math.abs(this.position_.x - this.previousPosition_.x) > 0)
		this.drawPosition_.x = Math.floor(this.position_.x * alpha + this.previousPosition_.x * (1 - alpha));

	if (Math.abs(this.position_.y - this.previousPosition_.y) > 0)
		this.drawPosition_.y = Math.floor(this.position_.y * alpha + this.previousPosition_.y * (1 - alpha));*/

	/*this.drawPosition_.x = this.position_.x * alpha + this.previousPosition_.x * (1 - alpha);
	this.drawPosition_.y = this.position_.y * alpha + this.previousPosition_.y * (1 - alpha);*/

	this.drawPosition_.x = lerp(this.previousPosition_.x, this.position_.x, alpha);
	this.drawPosition_.y = lerp(this.previousPosition_.y, this.position_.y, alpha);
	this.drawRotation_ = lerp(this.previousRotation_, this.rotation_, alpha);
}

GameObject.prototype.draw = function(context) {
	if (!this.image_)
		return;
	
	context.save();
	context.translate(this.drawPosition_.x, this.drawPosition_.y);
	context.rotate(this.drawRotation_);
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
	return this.velocity_;
}

Light.prototype = new GameObject();

function Light(x, y) {
	GameObject.call(this);

	this.frames_ = Resources.lights["light-100"].frames;
	this.radius_ = Resources.lights["light-100"].radius;
	this.position_ = new Vector2(x, y);
	this.frame_ = 0;
	this.duration_ = 0.1;
	this.time_ = 0;
	this.frameCount_ = this.frames_.length;
};

Light.prototype.update = function(dt) {
	this.time_ += dt;

	while (this.time_ > this.duration_) {
		this.time_ -= this.duration_;
		this.frame_++;

		if (this.frame_ === this.frameCount_ * 2)
			this.frame_ = 1;
	}
};

Light.prototype.draw = function(context) {
	var frame = this.frame_;
	var frameCount = this.frameCount_;
	var gradient = this.frames_[frame >= frameCount ? 2 * frameCount - frame - 1 : frame];
	var previousFill = context.fillStyle;

	context.fillStyle = gradient;
	context.translate(this.position_.x, this.position_.y);
	context.fillRect(-this.radius_, -this.radius_, 2 * this.radius_, 2 * this.radius_);
	context.translate(-this.position_.x, -this.position_.y);
	context.fillStyle = previousFill;
};

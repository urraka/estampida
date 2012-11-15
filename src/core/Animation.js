function Animation() {
	this.id_ = null;
	this.currentAnimation_ = null;
	this.currentFrame_ = 0;
	this.time_ = 0;
}

Animation.prototype.set = function(id) {
	if (id in Resources.animations) {
		this.id_ = id;
		this.currentAnimation_ = Resources.animations[id];
		this.currentFrame_ = 0;
		this.time_ = 0;
	}
}

Animation.prototype.get = function() {
	return this.id_;
}

Animation.prototype.is = function(id) {
	return this.id_ === id;
}

Animation.prototype.update = function(dt) {
	if (this.currentAnimation_ !== null) {
		var duration = this.getFrameDuration(this.currentFrame_);

		if (duration === 0) {
			return;
		}

		this.time_ += dt;

		while (this.time_ > duration) {
			this.time_ -= duration;
			this.currentFrame_++;

			if (this.currentFrame_ === this.currentAnimation_.frames.length) {
				this.currentFrame_ = 0;
			}

			duration = this.getFrameDuration(this.currentFrame_);

			if (duration === 0) {
				return;
			}
		}
	}
}

Animation.prototype.getFrameDuration = function(frame) {
	var duration = 0;

	if ("duration" in this.currentAnimation_.frames[frame]) {
		duration = this.currentAnimation_.frames[frame].duration;
	}
	else if ("frameDuration" in this.currentAnimation_) {
		duration = this.currentAnimation_.frameDuration;
	}

	return duration;
}

Animation.prototype.updateClipRect = function(rc) {
	if (this.currentAnimation_ !== null) {
		rc.left = this.currentAnimation_.frames[this.currentFrame_].left;
		rc.top = this.currentAnimation_.frames[this.currentFrame_].top;
		rc.width = this.currentAnimation_.frameWidth;
		rc.height = this.currentAnimation_.frameHeight;
	}
}

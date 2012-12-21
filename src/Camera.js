Camera.prototype = new GameObject();
Camera.prototype.locals_ = {};

Camera.kVelMultiplier = 2.5;

function Camera() {
	this.objective_ = null;
	this.view_ = new Rectangle();
}

Camera.prototype.update = function(dt) {
	this.previousPosition_.assignv(this.position_);
	
	var locals = this.locals_.update || (this.locals_.update = {
		distance: new Vector2()
	});

	if (!this.objective_)
		return;

	var distance = locals.distance.assignv(this.objective_.getPosition()).subtractv(this.position_);

	if (Math.abs(distance.x) < kEpsilon)
		distance.x = 0;

	if (Math.abs(distance.y) < kEpsilon)
		distance.y = 0;

	this.velocity_.assignv(distance).multiply(Camera.kVelMultiplier);
	this.position_.x += this.velocity_.x * dt;
	this.position_.y += this.velocity_.y * dt;
}

Camera.prototype.updateViewSize = function(width, height) {
	this.view_.width = width;
	this.view_.height = height;
}

Camera.prototype.getView = function() {
	this.view_.left = Math.floor(this.drawPosition_.x - this.view_.width / 2);
	this.view_.top = Math.floor(this.drawPosition_.y - this.view_.height / 2);
	return this.view_;
}

Camera.prototype.setObjective = function(objective) {
	this.objective_ = objective;
}

Camera.prototype.getObjective = function() {
	return this.objective_;
}

Camera.prototype.moveToObjective = function() {
	if (this.objective_)
		this.position_.assignv(this.objective_.getPosition());
}

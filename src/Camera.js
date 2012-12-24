Camera.prototype = new GameObject();
Camera.prototype.locals_ = {};

Camera.kVelMultiplier = 2.5;

function Camera() {
	this.objective_ = null;
	this.view_ = new Rectangle();

	this.zoom_ = 0;
	this.previousZoom_ = 0;
	this.interpolatedZoom_ = 0;
	this.zoomVelocity_ = 0.5;
	//this.maxZoomFactor_ = 1.1;
	this.maxZoomFactor_ = 2;
}

Camera.prototype.update = function(dt) {
	this.previousPosition_.assignv(this.position_);
	this.previousZoom_ = this.zoom_;
	
	var locals = this.locals_.update || (this.locals_.update = {
		distance: new Vector2(),
		objectBounds: new Rectangle()
	});

	if (Keyboard.isKeyPressed(Keyboard.Add))
		this.zoom_ += this.zoomVelocity_ * dt;
	else if (Keyboard.isKeyPressed(Keyboard.Subtract))
		this.zoom_ -= this.zoomVelocity_ * dt;

	this.zoom_ = Math.max(-1, Math.min(1, this.zoom_));

	if (!this.objective_)
		return;

	var objectBounds = this.objective_.getBoundingRect(this.objective_.getPosition(), locals.objectBounds);

	var distance = locals.distance;
	distance.assignxy(objectBounds.left + objectBounds.width / 2, objectBounds.top + objectBounds.height / 2);
	distance.subtractv(this.position_);

	if (Math.abs(distance.x) < kEpsilon)
		distance.x = 0;

	if (Math.abs(distance.y) < kEpsilon)
		distance.y = 0;

	this.velocity_.assignv(distance).multiply(Camera.kVelMultiplier);
	this.position_.x += this.velocity_.x * dt;
	this.position_.y += this.velocity_.y * dt;
}

Camera.prototype.interpolate = function(alpha) {
	GameObject.prototype.interpolate.call(this, alpha);
	this.interpolatedZoom_ = this.zoom_ * alpha + this.previousZoom_ * (1 - alpha);
}

Camera.prototype.getZoomFactor = function() {
	return Math.exp(this.maxZoomFactor_ * this.interpolatedZoom_);
}

Camera.prototype.updateViewSize = function(width, height) {
	this.view_.width = width;
	this.view_.height = height;
}

Camera.prototype.getView = function() {
	//this.view_.left = Math.floor(this.drawPosition_.x - this.view_.width / 2 / this.zoom_);
	//this.view_.top = Math.floor(this.drawPosition_.y - this.view_.height / 2 / this.zoom_);
	this.view_.left = this.drawPosition_.x - this.view_.width / 2 / this.getZoomFactor();
	this.view_.top = this.drawPosition_.y - this.view_.height / 2 / this.getZoomFactor();
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

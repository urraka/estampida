Player2.prototype = new GameObject();

function Player2() {
	GameObject.call(this);
	this.map_ = null;
	this.world_ = null;
	this.rc_ = new Rectangle();
	this.color_ = "rgba(255, 255, 0, 0.5)";
	this.moveResult_ = new Physics.MoveResult();
	this.dest_ = new Vector2();
	this.floorLine_ = null;

	this.position_.assignxy(400, 450);
	this.origin_.assignxy(26, 80);
}

Player2.prototype.update = function(dt) {
	this.previousPosition_.assignv(this.position_);

	var kVel = 250;
	this.velocity_.assign(0, 0);

	if (Keyboard.isKeyPressed(Keyboard.Left)) {
		this.velocity_.x = -kVel;
	}
	else if (Keyboard.isKeyPressed(Keyboard.Right)) {
		this.velocity_.x = kVel;
	}

	if (Keyboard.isKeyPressed(Keyboard.Up)) {
		this.velocity_.y = -kVel;
	}
	else if (Keyboard.isKeyPressed(Keyboard.Down)) {
		this.velocity_.y = kVel;
	}

	this.dest_.assignv(this.position_).addxy(this.velocity_.x * dt, this.velocity_.y * dt);
	this.world_.moveObject(this, this.dest_, this.moveResult_);
	this.position_.assignv(this.moveResult_.position);

	if (this.moveResult_.collisionLine)
		this.color_ = "rgba(255, 0, 0, 0.5)";
	else
		this.color_ = "rgba(255, 255, 0, 0.5)";
}

Player2.prototype.draw = function(context) {
	var rc = new Rectangle();
	this.getBoundingRect(this.drawPosition_, rc);

	context.save();
	context.fillStyle = this.color_;
	context.lineWidth = 1;
	context.fillRect(rc.left, rc.top, rc.width, rc.height);
	context.fillStyle = "#F00";
	context.beginPath();
	context.arc(this.drawPosition_.x, this.drawPosition_.y, 3, 0, 2 * Math.PI);
	context.fill();
	context.restore();
}

Player2.prototype.getBoundingRect = function(position, rc) {
	rc.width = 52;
	rc.height = 80;
	rc.left = position.x - this.origin_.x;
	rc.top = position.y - this.origin_.y;
	return rc;
}

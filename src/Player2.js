Player2.prototype = new GameObject();

function Player2() {
	GameObject.call(this);

	this.world_ = null; // Physics.World object
	this.color_ = "rgba(255, 255, 0, 0.5)";
	this.touchedLine_ = null;

	this.acceleration_ = new Vector2();
	this.position_.assignxy(400, 450);
	this.origin_.assignxy(26, 80);
}

Player2.prototype.locals_ = {};

Player2.prototype.update = function(dt) {
	this.previousPosition_.assignv(this.position_); // used for frame interpolation
	this.move(dt);
}

Player2.prototype.move = function(dt) {
	var locals = this.locals_.move || (this.locals_.move = {
		moveResult: new Physics.MoveResult(),
		dest: new Vector2(),
		vel: new Vector2()
	});

	// some constants

	var kWalkVel = 250;
	var kJumpVel = -550;
	var kGravity = 9.8 * 150;

	var kMoveNone = 0;
	var kMoveLeft = 1;
	var kMoveRight = 2;

	var moveDirection = kMoveNone;

	if (Controller.isPressed(Controller.Jump))
		this.jump(kJumpVel);

	if (Controller.isPressed(Controller.Left))
		moveDirection = kMoveLeft;
	else if (Controller.isPressed(Controller.Right))
		moveDirection = kMoveRight;

	this.acceleration_.assign(0, kGravity);
	this.velocity_.x = (moveDirection === kMoveRight) ? kWalkVel : (moveDirection == kMoveLeft ? -kWalkVel : 0);
	this.velocity_.y += this.acceleration_.y * dt;

	var moveResult = locals.moveResult;
	var line = this.touchedLine_;
	var dest = locals.dest;
	var vel = locals.vel.assignv(this.velocity_).multiply(dt);

	if (line && line.isFloor) {
		this.velocity_.y = vel.y = 0; // ignore Y component

		if (vel.x !== 0) { // i can do this because velocity is hard-code assigned, otherwise i should compare with epsilon, i guess?

			// change vel direction to match line slope

			var velx = vel.x;
			var destPoint = line.p2;
			vel.x = line.p2.x - line.p1.x;
			vel.y = line.p2.y - line.p1.y;

			if (vel.x * velx < 0) { // if signs of the numbers are different it has the wrong direction
				vel.x = -vel.x;
				vel.y = -vel.y;
				destPoint = line.p1;
			}

			vel.normalize();
			vel.multiply(Math.abs(velx)); // this could be change to go slower or faster depending line slope

			// if vel goes beyond the current floor line, change its magnitude to avoid it and set current line to the adjacent one (if it's floor aswell)

			var x = this.position_.x + vel.x;

			if (vel.x > 0 && x > destPoint.x || vel.x < 0 && x < destPoint.x) {
				var r = vel.y / vel.x;
				vel.x = destPoint.x - this.position_.x;
				vel.y = vel.x * r;

				line.flag = false;

				if (destPoint === line.p1)
					line = line.previous;
				else
					line = line.next;

				if (line && !line.isFloor)
					line = null;

				if (line)
					line.flag = true;
			}
		}
	}
	else if (line) {
		// handle wall/roof collision
	}

	if (!vel.equalsxy(0, 0)) {
		dest.assignv(this.position_).addv(vel);
		this.world_.moveObject(this, dest, moveResult);
		this.position_.assignv(moveResult.position);

		if (moveResult.collisionLine) {
			if (line) line.flag = false;
			line = moveResult.collisionLine;
			line.flag = true;
		}
		else if (line && !line.isFloor) {
			line.flag = false;
			line = null;
		}
	}

	this.touchedLine_ = line; // keep the current line for next update
}

Player2.prototype.jump = function(value) {
	if (this.touchedLine_ && this.touchedLine_.isFloor) {
		this.velocity_.y = value;
		this.touchedLine_.flag = false;
		this.touchedLine_ = null; // detach from floor
	}
}

Player2.prototype.getBoundingRect = function(position, rc) {
	rc.width = 52;
	rc.height = 80;
	rc.left = position.x - this.origin_.x;
	rc.top = position.y - this.origin_.y;
	return rc;
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

/*
Player2.prototype.calculateVelocity_ = function() {
	var locals = this.locals_.calculateVelocity_ || (this.locals_.calculateVelocity_ = {
		dir: new Vector2()
	});

	var currentLine = this.moveResult_.collisionLine;
	var magnitude = 0;

	if (!currentLine) {
		return this.velocity_.magnitude();
	}

	if (currentLine.isFloor) {
		this.velocity_.y = 0;
		magnitude = Math.abs(this.velocity_.x);

		var p1 = currentLine.p1;
		var p2 = currentLine.p2;

		if (p1.x > p2.x) {
			p1 = currentLine.p2;
			p2 = currentLine.p1;
		}

		if (this.velocity_.x > 0) {
			this.velocity_.x = p2.x - p1.x;
			this.velocity_.y = p2.y - p1.y;
		}
		else {
			this.velocity_.x = p1.x - p2.x;
			this.velocity_.y = p1.y - p2.y;
		}

		this.velocity_.normalize();
		this.velocity_.multiply(magnitude);
	}
	else {
		var dir = locals.dir.assignv(currentLine.p2).subtractv(currentLine.p1).normalize();
		this.velocity_.x = 0;
		magnitude = dir.dotv(this.velocity_);
		this.velocity_.assignv(dir.multiply(magnitude));
	}

	return magnitude;
}
*/
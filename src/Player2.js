Player2.prototype = new GameObject();

function Player2() {
	GameObject.call(this);

	this.slowMotion = false;

	this.world_ = null; // Physics.World object
	this.color_ = "rgba(255, 255, 0, 0.5)";
	this.touchedLine_ = null;
	this.touchedHull_ = new Physics.LineHull();

	var kGravity = 9.8 * 150;
	this.acceleration_ = new Vector2(0, kGravity);
	this.position_.assignxy(200, 400);
	this.origin_.assignxy(26, 80);
}

Player2.prototype.locals_ = {};

Player2.prototype.update = function(dt) {
	this.previousPosition_.assignv(this.position_); // used for frame interpolation

	if (this.slowMotion)
		dt /= 5;

	this.move(dt);
}

Player2.prototype.move = function(dt, recursionCount) {
	var locals = this.locals_.move || (this.locals_.move = {
		moveResult: new Physics.MoveResult(),
		dest: new Vector2(),
		vel: new Vector2(),
		dir: new Vector2()
	});

	recursionCount = recursionCount || 0;

	// some constants

	var kWalkVel = 250;
	var kJumpVel = -550;

	var walkSpeed = 0;

	if (Controller.isPressed(Controller.Left))
		walkSpeed = -kWalkVel;
	else if (Controller.isPressed(Controller.Right))
		walkSpeed = kWalkVel;

	if (Controller.isPressed(Controller.Jump))
		this.jump(kJumpVel, walkSpeed);

	this.velocity_.x = walkSpeed;

	var moveResult = locals.moveResult;
	var line = this.touchedLine_;
	var dest = locals.dest;
	var vel = locals.vel.assignv(this.velocity_).multiply(dt);

	var percent = 1;
	var repeat = false;

	if (line && line.isFloor) {
		this.velocity_.y = vel.y = 0; // ignore Y component

		if (vel.x !== 0) { // i can do this because velocity.x is hard-code assigned, otherwise i should compare with epsilon, i guess?

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

			var magnitude = Math.abs(velx);
			vel.normalize();
			vel.multiply(magnitude); // this could be changed to go slower or faster depending line slope (i guess)

			// if vel goes beyond the current floor line, change its magnitude to avoid it and set current line to the adjacent one (if it's a floor line)

			var x = this.position_.x + vel.x;

			if (vel.x > 0 && x > destPoint.x || vel.x < 0 && x < destPoint.x) {
				var r = vel.y / vel.x;
				vel.x = destPoint.x - this.position_.x;
				vel.y = vel.x * r;

				this.touchedHull_.realLine.flag = false;

				if (destPoint === line.p1)
					line = line.previous;
				else
					line = line.next;

				if (line && !line.isFloor) {
					line = null;
				}

				if (line && line !== this.touchedHull_.line && line !== this.touchedHull_.line1 && line !== this.touchedHull_.line2) {
					this.world_.createLineHull(this, line, this.touchedHull_);
					this.touchedHull_.realLine.flag = true;
				}
				else if (line) {
					this.touchedHull_.realLine.flag = true;
				}

				repeat = true;
				percent = vel.magnitude() / magnitude;
			}
		}
	}
	else if (line) {
		// handle wall/roof collision

		this.velocity_.x = 0;

		if (this.velocity_.dotv(line.normal) < 0) {
			var dir = locals.dir.assignv(line.p2).subtractv(line.p1).normalize();
			magnitude = dir.dotv(this.velocity_);
			this.velocity_.assignv(dir.multiply(magnitude));
			vel.assignv(this.velocity_).multiply(dt);
		}
		else {
			vel.x = 0;
		}
	}

	if (!vel.equalsxy(0, 0)) {
		dest.assignv(this.position_).addv(vel);
		this.world_.moveObject(this, dest, moveResult);
		this.position_.assignv(moveResult.position);

		if (moveResult.collisionLineIndex !== -1) {
			if (line) this.touchedHull_.realLine.flag = false;
			this.touchedHull_.assign(moveResult.collisionHull);
			line = this.touchedHull_.getLine(moveResult.collisionLineIndex);
			this.touchedHull_.realLine.flag = true;

			repeat = true;
			percent *= moveResult.percent;
		}
		else if (line && !line.isFloor) {
			this.touchedHull_.realLine.flag = false;
			line = null;
		}
	}

	this.touchedLine_ = line; // keep the current line for next update

	this.velocity_.y += this.acceleration_.y * dt * percent; // doing this at the end because i need percent. could be better to do it before, outside move method instead
	
	if (recursionCount < 1 && repeat) {
		this.move(dt * (1 - percent), recursionCount + 1); // warning: only call this at the end (read notes on QuadTree.subdivide)
	}
}

Player2.prototype.jump = function(jumpVel, walkSpeed) {
	if (this.touchedLine_ && this.touchedLine_.isFloor) {
		var slope = this.touchedLine_.slope();

		if (walkSpeed === 0 || slope === 0 ||
			(slope > 0 && (walkSpeed > 0 || jumpVel / walkSpeed > slope)) ||
			(slope < 0 && (walkSpeed < 0 || jumpVel / walkSpeed < slope))) {
			this.velocity_.y = jumpVel;
			this.touchedHull_.realLine.flag = false;
			this.touchedLine_ = null; // detach from floor
		}
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

	if (!this.velocity_.equalsxy(0, 0)) {
		context.beginPath();
		context.moveTo(this.drawPosition_.x, this.drawPosition_.y);
		context.lineTo(this.drawPosition_.x + this.velocity_.x / 10, this.drawPosition_.y + this.velocity_.y / 10);
		context.stroke();

		context.beginPath();
		context.moveTo(this.drawPosition_.x + this.velocity_.x / 10, this.drawPosition_.y + this.velocity_.y / 10);
		context.fill();
	}

	context.beginPath();
	context.arc(this.drawPosition_.x, this.drawPosition_.y, 3, 0, 2 * Math.PI);
	context.fill();

	context.restore();
}

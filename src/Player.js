Player.prototype = new GameObject();

function Player() {
	GameObject.call(this);

	this.map_ = null;
	this.acceleration_ = new Vector2();

	this.image_ = Resources.images["perro"];

	this.origin_.x = 26;
	this.origin_.y = 78;

	this.collides_ = {
		top: false,
		bottom: false,
		left: false,
		right: false,
		any: function() { return this.top || this.bottom || this.left || this.right; },
		x: function() { return this.left || this.right; },
		y: function() { return this.top || this.bottom; }
	};
}

Player.prototype.initialize = function(map) {
	this.map_ = map;
	this.position_.x = 300;
	this.position_.y = 300;
}

Player.prototype.update = function(dt) {
	this.previousPosition_.assign(this.position_);

	var kWalkAcc = 800;
	var kMaxWalkVel = 250;
	var kJumpVel = 550;
	var kGravity = 9.8 * 150;

	this.velocity_.x = 0;
	this.acceleration_.assign(0, kGravity);

	if (Keyboard.isKeyPressed(Keyboard.Left)) {
		this.velocity_.x = -kMaxWalkVel;
		this.flipX_ = false;
	}
	else if (Keyboard.isKeyPressed(Keyboard.Right)) {
		this.velocity_.x = kMaxWalkVel;
		this.flipX_ = true;
	}

	if (this.collides_.bottom && Keyboard.isKeyPressed(Keyboard.Up)) {
		this.velocity_.y = -kJumpVel;
	}

	this.velocity_.add(this.acceleration_.x * dt, this.acceleration_.y * dt);
	this.position_.add(this.velocity_.x * dt, this.velocity_.y * dt);

	this.checkMapCollision();

	if (this.collides_.y()) {
		this.velocity_.y = 0;
	}

	if (this.collides_.bottom) {
		if (this.velocity_.x != 0 && !this.collides_.x()) {
			if (!this.animation_.is("walking")) {
				this.animation_.set("walking", 1);
			}
		}
		else {
			this.animation_.set("standing");
		}
	}
	else {
		this.animation_.set("jumping");
	}

	this.animation_.update(dt);
	this.animation_.updateClipRect(this.clipRect_);
}

Player.prototype.checkMapCollision = function() {
	if (!this.checkMapCollisionVars_) {
		this.checkMapCollisionVars_ = {
			rc:      new Rectangle(),
			rcPrev:  new Rectangle(),
			pos:     new Vector2(),
			prevPos: new Vector2(),
			delta:   new Vector2()
		}
	}

	this.collides_.top = false;
	this.collides_.bottom = false;
	this.collides_.left = false;
	this.collides_.right = false;

	var rc = this.checkMapCollisionVars_.rc;
	var rcPrevious = this.checkMapCollisionVars_.rcPrev;

	this.getBoundingRect(this.position_, rc);
	this.getBoundingRect(this.previousPosition_, rcPrevious);

	if (!this.map_.checkCollision(rc.expand(rcPrevious))) {
		return;
	}

	var pos     = this.checkMapCollisionVars_.pos;
	var prevPos = this.checkMapCollisionVars_.prevPos;
	var delta   = this.checkMapCollisionVars_.delta;

	delta.assignVector(this.position_).subtractVector(this.previousPosition_);

	var fast = "x";
	var slow = "y";

	if (Math.abs(delta.y) > Math.abs(delta.x)) {
		fast = "y";
		slow = "x";
	}

	delta.assignCoord(slow, delta.coord(slow) / Math.abs(delta.coord(fast)));
	delta.assignCoord(fast, delta.coord(fast) > 0 ? 1 : (delta.coord(fast) < 0 ? -1 : 0));

	pos.assignVector(this.previousPosition_);

	while (!pos.equalsVector(this.position_)) {
		for (var i = 0; i < 2; i++) {
			var current = (i == 0 ? fast : slow);
			var other = (i == 0 ? slow : fast);

			if (pos.coord(current) === this.position_.coord(current)) {
				continue;
			}

			prevPos.assignVector(pos);

			if (Math.abs(this.position_.coord(current) - pos.coord(current)) <= Math.abs(delta.coord(current))) {
				pos.assignCoord(current, this.position_.coord(current));
			}
			else {
				pos.assignCoord(current, pos.coord(current) + delta.coord(current));
			}

			this.getBoundingRect(pos, rc);

			if (!this.map_.checkCollision(rc)) {
				continue;
			}

			if (current === "x") {
				if (this.position_.x - this.previousPosition_.x > 0)
					this.collides_.right = true;
				else
					this.collides_.left = true;
			}
			else {
				if (this.position_.y - this.previousPosition_.y > 0)
					this.collides_.bottom = true;
				else
					this.collides_.top = true;
			}

			if (pos.coord(current) === Math.floor(pos.coord(current))) {
				pos.assignCoord(current, Math.floor(prevPos.coord(current)));
			}
			else {
				if (delta.coord(current) > 0) {
					pos.assignCoord(current, Math.floor(pos.coord(current)));
				}
				else {
					pos.assignCoord(current, Math.ceil(pos.coord(current)));
				}
			}

			this.position_.assignCoord(current, pos.coord(current));
			delta.assignCoord(current, 0);

			if (current === fast) {
				delta.assignCoord(other, delta.coord(other) > 0 ? 1 : (delta.coord(other) < 0 ? -1 : 0));
			}
		}
	}
}

Player.prototype.getBoundingRect = function(position, rc) {
	rc.width = 52;
	rc.height = 80;
	rc.left = position.x - this.origin_.x;
	rc.top = position.y - this.origin_.y;

	return rc;
}

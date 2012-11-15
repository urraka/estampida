Player.prototype = new GameObject();

function Player() {
	GameObject.call(this);

	this.image_ = Resources.images["perro"];
	this.animation_.set("walk");
	this.animation_.updateClipRect(this.clipRect_);

	this.origin_.x = 26;
	this.origin_.y = 78;

	this.position_.x = 100;
	this.position_.y = 100;
}

Player.prototype.update = function(dt) {
	this.previousPosition_.assign(this.position_);

	this.animation_.update(dt);
	this.animation_.updateClipRect(this.clipRect_);

	if (this.position_.x <= 100) {
		this.velocity_.x = 250;
		this.flipX_ = true;
	}
	else if (this.position_.x >= 700) {
		this.velocity_.x = -250;
		this.flipX_ = false;
	}

	this.position_.x += this.velocity_.x * dt;
}

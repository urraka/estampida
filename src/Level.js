function Level() {
	this.viewRect_ = new Rectangle();
	this.map = new Map();
	this.player = new Player();
}

Level.prototype.loadMap = function(name) {
	this.map.load(name);
	this.player.initialize(this.map);
}

Level.prototype.updateViewSize = function(size) {
	this.viewRect_.width = size.x;
	this.viewRect_.height = size.y;
}

Level.prototype.update = function(dt) {
	this.player.update(dt);
}

Level.prototype.interpolate = function(alpha) {
	this.player.interpolate(alpha);

	this.viewRect_.left = this.player.drawPosition_.x - this.viewRect_.width / 2;
	this.viewRect_.top = this.player.drawPosition_.y - this.viewRect_.height / 2;
}

Level.prototype.draw = function(context) {
	var background = context.createLinearGradient(0, 0, 0, this.viewRect_.height);
	background.addColorStop(0, "#00F");
	background.addColorStop(1, "#FFF");

	context.save();
	context.fillStyle = background;
	context.fillRect(0, 0, this.viewRect_.width, this.viewRect_.height);

	context.translate(-Math.floor(this.viewRect_.left), -Math.floor(this.viewRect_.top));

	this.map.draw(context, this.viewRect_);
	this.player.draw(context);
	
	context.restore();
}

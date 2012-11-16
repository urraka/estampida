function Level() {
	this.viewSize_ = new Vector2();
	this.map = new Map();
	this.player = new Player();
}

Level.prototype.loadMap = function(name) {
	this.map.load(name);
}

Level.prototype.updateViewSize = function(size) {
	this.viewSize_.assign(size);
}

Level.prototype.update = function(dt) {
	this.player.update(dt);
}

Level.prototype.interpolate = function(alpha) {
	this.player.interpolate(alpha);
}

Level.prototype.draw = function(context) {
	var size = this.viewSize_;
	var background = context.createLinearGradient(0, 0, 0, size.y);
	background.addColorStop(0, "#00F");
	background.addColorStop(1, "#FFF");

	context.save();
	context.fillStyle = background;
	context.fillRect(0, 0, size.x, size.y);

	//context.translate(-50, -50);

	this.map.draw(context);
	this.player.draw(context);
	
	context.restore();
}

function Level() {
	this.player = new Player();
}

Level.prototype.update = function(dt) {
	this.player.update(dt);
}

Level.prototype.interpolate = function(alpha) {
	this.player.interpolate(alpha);
}

Level.prototype.draw = function(context) {
	var size = this.game_.getRenderWindow().getLogicalSize();

	context.save();
	context.fillStyle = "#666";
	context.fillRect(0, 0, size.x, size.y);

	this.player.draw(context);
	
	context.restore();
}

function Loading() {
	
}

Loading.prototype.update = function(dt) {}

Loading.prototype.interpolate = function(alpha) {}

Loading.prototype.draw = function(context) {
	var size = this.game_.getRenderWindow().getLogicalSize();

	context.save();
	context.fillStyle = "#000";
	context.fillRect(0, 0, size.x, size.y);
	context.fillStyle = "#FFF";
	context.font = "bold 16px verdana";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText("Loading...", size.x / 2, size.y / 2);
	context.restore();
}

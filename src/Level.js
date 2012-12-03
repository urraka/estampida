function Level() {
	this.viewRect_ = new Rectangle();
	this.map = new Map();
	this.player = new Player();

	this.map2 = new Map2();
	this.player2 = new Player2();
	this.player2.map_ = this.map2;

	// create world object

	var lineStrip = [
		new Vector2(20, 450),
		new Vector2(200, 300),
		new Vector2(600, 200),
		new Vector2(650, 500),
		new Vector2(600, 500),
		new Vector2(500, 580),
		new Vector2(350, 540),
		new Vector2(300, 500),
		new Vector2(200, 450),
		new Vector2(100, 500),
		new Vector2(20, 450)
	];

	var nLines = lineStrip.length;
	var rc = new Rectangle();
	var bounds = new Rectangle(lineStrip[0].x, lineStrip[0].y, 0, 0);
	var line = new Line();

	for (var i = 0; i < nLines - 2; i++) {
		line.assignp(lineStrip[i], lineStrip[i + 1]);
		bounds.expand(line.getBounds(rc));
	}

	this.world = new Physics.World(bounds);
	this.world.addLineStrip(lineStrip);
	this.player2.world_ = this.world;
}

Level.prototype.loadMap = function(name) {
	//this.map.load(name);
	//this.player.initialize(this.map);
}

Level.prototype.updateViewSize = function(size) {
	this.viewRect_.width = size.x;
	this.viewRect_.height = size.y;
}

Level.prototype.update = function(dt) {
	//this.player.update(dt);
	this.player2.update(dt);
}

Level.prototype.interpolate = function(alpha) {
	//this.player.interpolate(alpha);
	this.player2.interpolate(alpha);
	this.viewRect_.left = Math.floor(this.player2.drawPosition_.x - this.viewRect_.width / 2);
	this.viewRect_.top = Math.floor(this.player2.drawPosition_.y - this.viewRect_.height / 2);

	//this.viewRect_.left = this.player.drawPosition_.x - this.viewRect_.width / 2;
	//this.viewRect_.top = this.player.drawPosition_.y - this.viewRect_.height / 2;
}

Level.prototype.draw = function(context) {
	var background = context.createLinearGradient(0, 0, 0, this.viewRect_.height);
	background.addColorStop(0, "#00F");
	background.addColorStop(1, "#FFF");

	context.save();
	context.fillStyle = background;
	context.fillRect(0, 0, this.viewRect_.width, this.viewRect_.height);
	context.translate(-Math.floor(this.viewRect_.left), -Math.floor(this.viewRect_.top));
	this.world.draw(context);
	//this.map2.draw(context);
	this.player2.draw(context);

/*
	context.translate(-Math.floor(this.viewRect_.left), -Math.floor(this.viewRect_.top));
	this.map.draw(context, this.viewRect_);
	this.player.draw(context);
	context.translate(Math.floor(this.viewRect_.left), Math.floor(this.viewRect_.top));
	Controller.draw(context);
*/

	context.restore();
}

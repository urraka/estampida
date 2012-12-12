function Level() {
	this.viewRect_ = new Rectangle();
	this.map = new Map();
	this.player = new Player();

	this.map2 = new Map2();
	this.player2 = new Player2();
	this.player2.map_ = this.map2;

	this.lineModes = [
		"Lines mode: highlight all lines retrieved from QuadTrees.",
		"Lines mode: don't highlight lines outside object bounds.",
		"Lines mode: don't highlight lines outside object bounds or lines facing opposite direction.",
		"Lines mode: highlight only intersected lines."
	];

	Keyboard.bind(this, this.onKeyChanged);

	// create world object

	var lineStrips1 = [
		[
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
		]
	];

	var lineStrips2 = [
		[
			new Vector2(34.3, 222),
			new Vector2(109.1, 84.6),
			new Vector2(259.6, 21),
			new Vector2(409.1, 59.4),
			new Vector2(539.4, 26),
			new Vector2(678.8, -49.7),
			new Vector2(809.1, -34.6),
			new Vector2(863.7, 45.2),
			new Vector2(841.5, 102.8),
			new Vector2(805.1, 118),
			new Vector2(757.6, 168.5),
			new Vector2(750.5, 280.6),
			new Vector2(832.4, 360.4),
			new Vector2(721.2, 611.9),
			new Vector2(636.4, 638.2),
			new Vector2(383.9, 697.8),
			new Vector2(154.6, 654.4),
			new Vector2(200, 711.9),
			new Vector2(223.2, 764.5),
			new Vector2(210.1, 873.6),
			new Vector2(76.8, 870.5),
			new Vector2(65.7, 801.8),
			new Vector2(4, 776.6),
			new Vector2(-14.1, 722),
			new Vector2(-102, 689.7),
			new Vector2(-237.4, 665.5),
			new Vector2(-217.4, 555.4),
			new Vector2(-217.2, 376.6),
			new Vector2(-55.6, 286.7),
			new Vector2(34.3, 222)
		],

		[
			new Vector2(-71.7, 595.8),
			new Vector2(-47.5, 640.2),
			new Vector2(34.3, 636.2),
			new Vector2(71.7, 618),
			new Vector2(98, 583.7),
			new Vector2(81.8, 546.3),
			new Vector2(-42.4, 556.4),
			new Vector2(-71.7, 595.8)
		],

		[
			new Vector2(193.9, 550.3),
			new Vector2(406.1, 531.1),
			new Vector2(551.5, 488.7),
			new Vector2(660.6, 359.4),
			new Vector2(702.1, 272.5),
			new Vector2(699, 207.9),
			new Vector2(649.5, 198.8),
			new Vector2(614.2, 218),
			new Vector2(569.7, 261.4),
			new Vector2(540.4, 289.7),
			new Vector2(411.1, 318),
			new Vector2(404.1, 371.5),
			new Vector2(344.5, 392.7),
			new Vector2(161.6, 517),
			new Vector2(193.9, 550.3)
		]
	];

	var lineStrips = lineStrips2;

	var line = new Line();
	var rc = new Rectangle();
	var bounds = new Rectangle(lineStrips[0][0].x, lineStrips[0][0].y, 0, 0);
	
	for (var iStrip = 0; iStrip < lineStrips.length; iStrip++) {
		var lineStrip = lineStrips[iStrip];
		var nLines = lineStrip.length;
		for (var i = 0; i < nLines - 2; i++) {
			line.assignp(lineStrip[i], lineStrip[i + 1]);
			bounds.expand(line.getBounds(rc));
		}
	}

	this.world = new Physics.World(bounds);

	for (var i = 0; i < lineStrips.length; i++)
		this.world.addLineStrip(lineStrips[i]);
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

Level.prototype.onKeyChanged = function(key, isKeyDown) {
	if (isKeyDown && key === Keyboard.Space) {
		this.world.linesHighlightMode_ = (this.world.linesHighlightMode_ + 1) % 4;
	}
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
	//context.fillStyle = background;
	context.fillStyle = "#CCC";
	context.fillRect(0, 0, this.viewRect_.width, this.viewRect_.height);
	context.translate(-Math.floor(this.viewRect_.left), -Math.floor(this.viewRect_.top));
	this.world.draw(context, this.player2);
	//this.map2.draw(context);
	this.player2.draw(context);

	context.translate(Math.floor(this.viewRect_.left), Math.floor(this.viewRect_.top));
	context.fillStyle = "#000";
	context.font = "12px verdana";
	context.textBaseline = "bottom";
	context.fillText(this.lineModes[this.world.linesHighlightMode_], 10, this.viewRect_.height - 10);

/*
	context.translate(-Math.floor(this.viewRect_.left), -Math.floor(this.viewRect_.top));
	this.map.draw(context, this.viewRect_);
	this.player.draw(context);
	context.translate(Math.floor(this.viewRect_.left), Math.floor(this.viewRect_.top));
	Controller.draw(context);
*/

	context.restore();
}

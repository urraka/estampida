function Level() {
	this.viewRect_ = new Rectangle();
	this.player2 = new Player2();

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

	this.world = null;
	this.maps = [lineStrips1, lineStrips2];
	this.setMap(this.maps[0]);
	this.debugMode = false;
}

Level.prototype.loadMap = function(name) {
}

Level.prototype.updateViewSize = function(size) {
	this.viewRect_.width = size.x;
	this.viewRect_.height = size.y;
}

Level.prototype.setMap = function(map) {
	this.world = null;

	var line = new Line();
	var rc = new Rectangle();
	var bounds = new Rectangle(map[0][0].x, map[0][0].y, 0, 0);
	
	for (var iStrip = 0; iStrip < map.length; iStrip++) {
		var lineStrip = map[iStrip];
		var nLines = lineStrip.length;
		for (var i = 0; i < nLines - 2; i++) {
			line.assignp(lineStrip[i], lineStrip[i + 1]);
			bounds.expand(line.getBounds(rc));
		}
	}

	this.world = new Physics.World(bounds);

	for (var i = 0; i < map.length; i++)
		this.world.addLineStrip(map[i]);

	this.lineStrips = map;
	this.player2.spawn(this.world, 200, 400);
}

Level.prototype.onKeyChanged = function(key, isKeyDown) {
	if (isKeyDown) {
		if (key === Keyboard.Space)
			this.player2.slowMotion = !this.player2.slowMotion;

		if (key === Keyboard.D)
			this.debugMode = !this.debugMode;

		if (key === Keyboard.Num1)
			this.setMap(this.maps[0]);

		if (key === Keyboard.Num2)
			this.setMap(this.maps[1]);
	}
}

Level.prototype.update = function(dt) {
	this.player2.update(dt);
}

Level.prototype.interpolate = function(alpha) {
	this.player2.interpolate(alpha);
	this.viewRect_.left = Math.floor(this.player2.drawPosition_.x - this.viewRect_.width / 2);
	this.viewRect_.top = Math.floor(this.player2.drawPosition_.y - this.viewRect_.height / 2);
}

Level.prototype.draw = function(context) {
	var background = context.createLinearGradient(0, 0, 0, this.viewRect_.height);
    background.addColorStop(0, "#00F");
    background.addColorStop(1, "#FFF");

	context.save();

	if (this.debugMode)
		context.fillStyle = "#CCC";
	else
		context.fillStyle = background;

	context.fillRect(0, 0, this.viewRect_.width, this.viewRect_.height);
	context.translate(-Math.floor(this.viewRect_.left), -Math.floor(this.viewRect_.top));

	if (this.debugMode)
		this.world.draw(context, this.player2);
	else
		this.drawMap(context);

	this.player2.draw(context, this.debugMode);
	context.restore();
}

Level.prototype.drawMap = function(context) {
	var texture = Resources.images["mapTexture"];
	var ground = context.createPattern(texture, "repeat");
	
	context.fillStyle = ground;

	var lineStrip = this.lineStrips[0];
	var len = lineStrip.length;
	var size = Math.max(this.viewRect_.width, this.viewRect_.height);
	
	context.beginPath();
	context.moveTo(lineStrip[0].x, lineStrip[0].y);

	for (var i = 1; i < len; i++)
		context.lineTo(lineStrip[i].x, lineStrip[i].y);

	context.lineTo(this.world.bounds_.left - size, lineStrip[len - 1].y);
	context.lineTo(this.world.bounds_.left - size, this.world.bounds_.top + this.world.bounds_.height + size);
	context.lineTo(this.world.bounds_.left + this.world.bounds_.width + size, this.world.bounds_.top + this.world.bounds_.height + size);
	context.lineTo(this.world.bounds_.left + this.world.bounds_.width + size, this.world.bounds_.top - size);
	context.lineTo(this.world.bounds_.left - size, this.world.bounds_.top - size);
	context.lineTo(this.world.bounds_.left - size, lineStrip[len - 1].y);
	context.closePath();
	context.fill();

	var lenStrips = this.lineStrips.length;

	for (var iStrip = 1; iStrip < lenStrips; iStrip++) {
		var lineStrip = this.lineStrips[iStrip];
		var len = lineStrip.length;

		context.beginPath();
		context.moveTo(lineStrip[0].x, lineStrip[0].y);

		for (var i = 1; i < len; i++)
			context.lineTo(lineStrip[i].x, lineStrip[i].y);

		context.fill();
	}
}

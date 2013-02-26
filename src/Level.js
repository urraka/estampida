function Level(game) {
	this.game = game;
	this.debugMode = false;
	this.player2 = new Player2();
	this.camera = new Camera();
	this.world = null;
	this.maps = null;
	this.textures = {};
	this.background = null;
	this.slowMotion = false;
	this.scenery = [];
	this.rocks = [];
	this.lightTime = 0;

	Keyboard.bind(this, this.onKeyChanged);

	// create world object

	var svg2json = {"lineStrips":[[{"x":-151,"y":-73},{"x":287,"y":-58},{"x":1033,"y":20},{"x":1360,"y":-20},{"x":1477,"y":442},{"x":1419,"y":677},{"x":1323,"y":792},{"x":1333,"y":890},{"x":1417,"y":1075},{"x":1176,"y":1104},{"x":949,"y":1030},{"x":735,"y":1034},{"x":654,"y":971},{"x":521,"y":900},{"x":426,"y":891},{"x":421,"y":822},{"x":257,"y":818},{"x":266,"y":893},{"x":250,"y":894},{"x":6,"y":941},{"x":-107,"y":1028},{"x":-119,"y":1051},{"x":-477,"y":1058},{"x":-600,"y":935},{"x":-770,"y":-33},{"x":-569,"y":8},{"x":-151,"y":-73}],[{"x":479,"y":764},{"x":564,"y":788},{"x":667,"y":769},{"x":839,"y":721},{"x":834,"y":659},{"x":724,"y":627},{"x":631,"y":656},{"x":479,"y":764}],[{"x":220,"y":565},{"x":105,"y":536},{"x":-30,"y":568},{"x":-36,"y":630},{"x":176,"y":678},{"x":303,"y":697},{"x":407,"y":673},{"x":220,"y":565}],[{"x":414,"y":553},{"x":499,"y":577},{"x":602,"y":558},{"x":774,"y":510},{"x":769,"y":448},{"x":659,"y":416},{"x":566,"y":445},{"x":414,"y":553}],[{"x":936,"y":445},{"x":914,"y":508},{"x":929,"y":560},{"x":983,"y":685},{"x":1139,"y":891},{"x":1237,"y":930},{"x":1044,"y":380},{"x":936,"y":445}],[{"x":-533,"y":480},{"x":-474,"y":540},{"x":-391,"y":531},{"x":-314,"y":490},{"x":-220,"y":545},{"x":-139,"y":560},{"x":-151,"y":502},{"x":-173,"y":467},{"x":-160,"y":448},{"x":-111,"y":445},{"x":-30,"y":492},{"x":13,"y":498},{"x":30,"y":481},{"x":-10,"y":462},{"x":-30,"y":424},{"x":-181,"y":364},{"x":-251,"y":370},{"x":-253,"y":321},{"x":-297,"y":302},{"x":-353,"y":254},{"x":-430,"y":194},{"x":-491,"y":197},{"x":-563,"y":214},{"x":-596,"y":240},{"x":-533,"y":480}],[{"x":-375,"y":745},{"x":-375,"y":875},{"x":-107,"y":875},{"x":-375,"y":745}],[{"x":733,"y":897},{"x":1001,"y":897},{"x":1001,"y":767},{"x":733,"y":897}],[{"x":315,"y":79},{"x":47,"y":79},{"x":47,"y":208},{"x":315,"y":79}],[{"x":-52,"y":264},{"x":-52,"y":135},{"x":-320,"y":135},{"x":-52,"y":264}]]};

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

	this.maps = [];
	this.maps.push({ lineStrips: lineStrips1, scenery: [] });
	this.maps.push({ lineStrips: lineStrips2, scenery: [] });
	this.maps.push({ lineStrips: svg2json["lineStrips"], scenery: [] });

	// scenery for map 3
	var sceneryData = [
		{ image: "tree-1", x: 664, y: 428, x0: 174, y0: 248, angle: 0 },
		{ image: "tree-2", x: 110, y: 380, x0: 0, y0: 0, angle: 0 },
		{ image: "tree-1", x: -326, y: 778, x0: 174, y0: 248, angle: 20 },
		{ image: "light", x: 1045, y: 400, x0: 13, y0: 247, angle: 5 }
	];

	for (var i = 0; i < sceneryData.length; i++) {
		var object = new GameObject();
		object.image_ = Resources.images[sceneryData[i].image];
		object.origin_.assignxy(sceneryData[i].x0, sceneryData[i].y0);
		object.drawPosition_.assignxy(sceneryData[i].x, sceneryData[i].y);
		object.drawRotation_ = sceneryData[i].angle * (Math.PI / 180);
		this.maps[2].scenery.push(object);
	}

	this.setMap(this.maps[2]);
	this.camera.setObjective(this.player2);
	this.camera.moveToObjective();
	
}

Level.prototype.load = function() {
	// generate "mipmaps"

	var groundTexture = Resources.images["mapTexture"];

	this.textures["ground"] = new Array(11);
	this.textures["ground"][0] = groundTexture;

	/*for (var i = 1; i <= 10; i++) {
		var scale = 1 - i * 0.1;
		var width = Math.floor(groundTexture.width * scale);
		var height = Math.floor(groundTexture.height * scale);
		var img = new RenderTarget();
		img.create(width, height);
		var ctx = img.getContext();
		ctx.scale(scale, scale);
		ctx.drawImage(groundTexture, 0, 0);
		this.textures["ground"][i] = img.getCanvas();
	}*/
}

Level.prototype.updateViewSize = function(size) {
	this.camera.updateViewSize(size.x, size.y);

	var context = this.game.getRenderWindow().getContext();
	this.background = context.createLinearGradient(0, 0, 0, size.y);
    this.background.addColorStop(0, "#333");
    this.background.addColorStop(1, "#999");
}

Level.prototype.setMap = function(map) {
	this.world = null;

	var lineStrips = map.lineStrips;
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

	// place rocks
	
	this.rocks = [];

	var vec = new Vector2();
	var rockImage = Resources.images["rock"];
	var maxRockSize = Math.max(rockImage.width, rockImage.height);
	var minRockStep = rockImage.width * 0.4;
	var maxRockStep = rockImage.width * 0.5;

	for (var i = lineStrips.length - 1; i >= 0; i--) {
		var lineStrip = lineStrips[i];
		var len = lineStrip.length;

		for (var j = 0; j < len - 1; j++) {
			var vec = vec.assignv(lineStrip[j + 1]).subtractv(lineStrip[j]);
			var magnitude = vec.magnitude();
			var angle = vec.normalize().angle();
			var edgeImageWidth = magnitude + 2 * maxRockSize;
			var edgeImageHeight = 2 * maxRockSize;
			var edgeImage = new RenderTarget();

			edgeImage.create(edgeImageWidth, edgeImageHeight);

			var ctx = edgeImage.getContext();
			var prevPos = 0;

			ctx.translate(maxRockSize, maxRockSize);

			for (var pos = 0; pos < magnitude; pos += rand(minRockStep, maxRockStep)) {
				var rot = rand(0, 2 * Math.PI);
				ctx.translate(pos - prevPos, 0);
				ctx.rotate(rot);
				ctx.drawImage(rockImage, -rockImage.width / 2, -rockImage.height / 2, rockImage.width, rockImage.height);
				ctx.rotate(-rot);

				prevPos = pos;
			}

			this.rocks.push({
				image: edgeImage.getCanvas(),
				x: lineStrip[j].x,
				y: lineStrip[j].y,
				width: edgeImageWidth,
				height: edgeImageHeight,
				x0: maxRockSize,
				y0: maxRockSize,
				rotation: angle
			});
		}
	}

	this.lineStrips = lineStrips;
	this.scenery = map.scenery;
	this.player2.spawn(this.world, 200, 400);
	this.camera.moveToObjective();
}

Level.prototype.onKeyChanged = function(key, isKeyDown) {
	if (isKeyDown) {
		if (key === Keyboard.Space)
			this.slowMotion = !this.slowMotion;

		if (key === Keyboard.D)
			this.debugMode = !this.debugMode;

		if (key === Keyboard.Num1)
			this.setMap(this.maps[0]);

		if (key === Keyboard.Num2)
			this.setMap(this.maps[1]);

		if (key === Keyboard.Num3)
			this.setMap(this.maps[2]);
	}
}

Level.prototype.update = function(dt) {
	if (this.slowMotion)
		dt /= 5;

	this.world.resetActiveLines();

	this.player2.update(dt);
	this.camera.update(dt);

	this.lightTime += dt;

	if (this.lightTime >= 2)
		this.lightTime -= 2;
}

Level.prototype.interpolate = function(alpha) {
	this.player2.interpolate(alpha);
	this.camera.interpolate(alpha);
}

Level.prototype.draw = function(context) {
	context.save();

	var view = this.camera.getView();

	if (this.debugMode)
		context.fillStyle = "#CCC";
	else
		context.fillStyle = this.background;

	context.fillRect(0, 0, view.width, view.height);

	context.scale(this.camera.getZoomFactor(), this.camera.getZoomFactor());
	context.translate(-view.left, -view.top);

	if (this.debugMode)
		this.world.draw(context, this.player2);
	else
		this.drawMap(context);

	this.player2.draw(context, this.debugMode);

	var lightValue = this.lightTime / 2;
	lightValue = Math.round(lerp(80, 140, lightValue > 0.5 ? 1 - lightValue : lightValue));
	var light = context.createRadialGradient(Math.cos(Math.PI * (this.lightTime - 1))*2, 2*Math.sin(Math.PI * (this.lightTime - 1)), 0, 0, 0, 100);

	light.addColorStop(0, "rgba(255, 255, 255, 0.8)");
	light.addColorStop(1, "rgba(" + lightValue + ", " + lightValue + ", " + lightValue + ", 0)");
	context.fillStyle = light;
	context.translate(1065, 185);
	context.fillRect(-100, -100, 200, 200)

	context.restore();

	Controller.draw(context);
}

Level.prototype.drawMap = function(context) {
	var view = this.camera.getView();
	var zoomFactor = this.camera.getZoomFactor();

	//var texture = this.textures["ground"][Math.min(10, 10 - Math.floor(zoomFactor < 1 ? zoomFactor * 10 : 10))];
	var texture = this.textures["ground"][0];
	var ground = context.createPattern(texture, "repeat");
	
	// scenery (trees)

	for (var i = this.scenery.length - 1; i >= 0; i--) {
		this.scenery[i].draw(context);
	}

	// rocks

	context.save();

	var prevX = 0;
	var prevY = 0;

	for (var i = this.rocks.length - 1; i >= 0; i--) {
		var rock = this.rocks[i];
		context.translate(rock.x - prevX, rock.y - prevY);
		context.rotate(rock.rotation);
		context.drawImage(rock.image, -rock.x0, -rock.y0, rock.width, rock.height);
		context.rotate(-rock.rotation);
		prevX = rock.x;
		prevY = rock.y;
	}

	context.restore();

	// polygons
	
	context.save();
	context.fillStyle = "#000";

	var lineStrip = this.lineStrips[0];
	var len = lineStrip.length;
	var size = Math.max(view.width / zoomFactor, view.height / zoomFactor);
	
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

	/*context.strokeStyle = "#000";

	for (var iStrip = 0; iStrip < lenStrips; iStrip++) {
		var lineStrip = this.lineStrips[iStrip];
		var len = lineStrip.length;

		context.beginPath();
		context.moveTo(lineStrip[0].x, lineStrip[0].y);

		for (var i = 1; i < len; i++) {
			if (i === len - 1)
				context.closePath();
			else
				context.lineTo(lineStrip[i].x, lineStrip[i].y);
		}

		context.stroke();
	}*/

	context.restore();
}

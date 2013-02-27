Game.prototype = new GameBase();

function Game() {
	GameBase.call(this);
	this.level_ = null;
}

Game.prototype.initialize = function() {
	var self = this;

	var renderWindow = this.getRenderWindow();
	var size = renderWindow.getSize();

	renderWindow.setLogicalSize(size);
	renderWindow.onResize(this, this.windowResize);

	this.showFps(true);
	this.setState(new Loading());

	var imagesInfo = [
		{ id: "perro", src: "images/perro3.png" },
		{ id: "guy", src: "images/guy.png" },
		{ id: "map", src: "images/map.png" },
		{ id: "mapTexture", src: "images/SandyHopscotch.png" },
		{ id: "controller", src: "images/controller.png" },
		{ id: "christmas", src: "images/navidad.png" },
		{ id: "tree-1", src: "images/tree-1.png" },
		{ id: "tree-2", src: "images/tree-2.png" },
		{ id: "rock", src: "images/rock.png" },
		{ id: "light", src: "images/light.png" }
	];

	var loadedCount = 0;

	function loadCheck() {
		if (++loadedCount === imagesInfo.length) {
			Controller.initialize();
			Controller.updateViewSize(size);
			
			self.level_ = new Level(self);
			self.level_.updateViewSize(self.getRenderWindow().getLogicalSize());
			self.setState(self.level_);
		}
	}

	for (i in imagesInfo) {
		var image = new Image();
		image.onload = loadCheck;
		image.src = imagesInfo[i].src + "?" + Date.now();
		Resources.images[imagesInfo[i].id] = image;
	}

	Resources.animations["standing"] = {
		frameWidth: 54,
		frameHeight: 82,
		frameDuration: 0,
		frames: [
			{ left: 0, top: 0 }
		]
	};

	Resources.animations["walking"] = {
		frameWidth: 54,
		frameHeight: 82,
		frameDuration: 0.1,
		frames: [
			{ left: 53, top: 0 },
			{ left: 106, top: 0 }
		]
	};

	Resources.animations["jumping"] = {
		frameWidth: 54,
		frameHeight: 82,
		frameDuration: 0,
		frames: [
			{ left: 53, top: 0 }
		]
	};

	Resources.animations["ducking"] = {
		frameWidth: 54,
		frameHeight: 82,
		frameDuration: 0,
		frames: [
			{ left: 212, top: 0 }
		]
	};

	Resources.animations["duckWalking"] = {
		frameWidth: 54,
		frameHeight: 82,
		frameDuration: 0.1,
		frames: [
			{ left: 265, top: 0 },
			{ left: 318, top: 0 }
		]
	};

	Resources.animations["duckFalling"] = {
		frameWidth: 54,
		frameHeight: 82,
		frameDuration: 0,
		frames: [
			{ left: 265, top: 0 }
		]
	};

	// lights
	
	var context = this.getRenderWindow().getContext();
	var frames = [];
	var radius = 100;

	for (var value = 80; value <= 130; value += 10) {
		var gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
		gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
		gradient.addColorStop(1, "rgba(" + value + ", " + value + ", " + value + ", 0)");
		frames.push(gradient);
	}

	Resources.lights["light-100"] = { "radius": radius, "frames": frames };
}

Game.prototype.windowResize = function(size) {
	this.getRenderWindow().setLogicalSize(size);

	if (this.level_) {
		this.level_.updateViewSize(size);
	}

	Controller.updateViewSize(size);
}

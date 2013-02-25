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
		{ id: "map", src: "images/map.png" },
		{ id: "mapTexture", src: "images/SandyHopscotch.png" },
		{ id: "controller", src: "images/controller.png" },
		{ id: "christmas", src: "images/navidad.png" }
	];

	var loadedCount = 0;

	function loadCheck() {
		if (++loadedCount === imagesInfo.length) {
			Controller.initialize();
			Controller.updateViewSize(size);
			
			self.level_ = new Level(self);
			self.level_.updateViewSize(self.getRenderWindow().getLogicalSize());
			self.level_.load();
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
}

Game.prototype.windowResize = function(size) {
	this.getRenderWindow().setLogicalSize(size);

	if (this.level_) {
		this.level_.updateViewSize(size);
	}

	Controller.updateViewSize(size);
}

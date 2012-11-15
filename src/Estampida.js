Estampida.prototype = new Game();

function Estampida() {
	Game.call(this);
}

Estampida.prototype.initialize = function() {
	var self = this;

	var renderWindow = this.getRenderWindow();
	var size = renderWindow.getSize();

	renderWindow.setLogicalSize(size);
	renderWindow.onResize(this.windowResize, this);

	this.showFps(true);
	this.setState(new Loading());

	var imagesInfo = [
		{ id: "perro", src: "images/perro.png" }
	];

	var loadedCount = 0;

	function loadCheck() {
		if (++loadedCount === imagesInfo.length) {
			self.setState(new Level());
		}
	}

	for (i in imagesInfo) {
		var image = new Image();
		image.onload = loadCheck;
		image.src = imagesInfo[i].src;
		Resources.images[imagesInfo[i].id] = image;
	}

	Resources.animations["walk"] = {
		frameWidth: 52,
		frameHeight: 80,
		frameDuration: 0.1,
		frames: [
			{ left: 52, top: 0 },
			{ left: 104, top: 0 }
		]
	};
}

Estampida.prototype.windowResize = function(size) {
	this.getRenderWindow().setLogicalSize(size);
}

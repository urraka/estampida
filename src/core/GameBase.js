function GameBase() {
	this.renderWindow_ = new RenderWindow();
	this.dt_ = 33;
	this.fps_ = 0;
	this.currentState_ = null;
	this.showFps_ = false;

	this.requestAnimationFrame =
		window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback){ window.setTimeout(callback, 1); };
}

GameBase.prototype.start = function(element) {
	this.renderWindow_.create(element);

	Keyboard.initialize();

	this.initialize();
	this.mainLoop();
}

GameBase.prototype.getRenderWindow = function() {
	return this.renderWindow_;
}

GameBase.prototype.mainLoop = function() {
	var self = this;

	var fpsCount = 0;
	var fpsTime = 0;

	var maxFrameTime = 250;

	var t = 0;
	var accumulator = 0;
	var currentTime = Date.now();

	self.currentState_.update(self.dt_ / 1000);

	function frame() {
		var newTime = Date.now();
		var frameTime = newTime - currentTime;

		fpsTime += frameTime;

		if (fpsTime >= 1000) {
			fpsTime -= 1000;
			self.fps_ = fpsCount;
			fpsCount = 0;
		}

		if (frameTime > maxFrameTime) {
			frameTime = maxFrameTime;
		}

		currentTime = newTime;
		accumulator += frameTime;

		while (accumulator >= self.dt_) {
			self.currentState_.update(self.dt_ / 1000);
			t += self.dt_;
			accumulator -= self.dt_;
		}

		var alpha = accumulator / self.dt_;

		self.currentState_.interpolate(alpha);
		self.currentState_.draw(self.renderWindow_.getContext());

		if (self.showFps_) {
			var context = self.renderWindow_.getContext();
			context.save();
			context.fillStyle = "#FF0";
			context.font = "bold 12px verdana";
			context.textBaseline = "top";
			context.fillText("FPS: " + self.fps_, 10, 10);
			context.restore();
		}

		self.renderWindow_.display();

		fpsCount++;

		self.requestAnimationFrame.call(window, frame);
	}

	frame();
}

GameBase.prototype.setState = function(state) {
	state.game_ = this;
	this.currentState_ = state;
}

GameBase.prototype.getFps = function() {
	return this.fps_;
}

GameBase.prototype.showFps = function(showFps) {
	this.showFps_ = showFps;
}

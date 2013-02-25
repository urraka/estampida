// ControllerButton

ControllerButton.prototype = new GameObject();

function ControllerButton() {
	GameObject.call(this);

	this.area_ = new Rectangle();

	this.isKeyDown_ = false;
	this.isTouched_ = false;
	this.isClicked_ = false;
}

ControllerButton.prototype.setPosition = function(x, y) {
	this.position_.assignxy(x, y);
	this.previousPosition_.assignxy(x, y);
	this.drawPosition_.assignxy(x, y);
}

ControllerButton.prototype.setArea = function(x, y, w, h) {
	this.area_.assign(x, y, w, h);
}

ControllerButton.prototype.setImage = function(image, clipRect) {
	this.image_ = image;
	if (clipRect) this.clipRect_.assign(clipRect);
}

ControllerButton.prototype.isPressed = function() {
	return this.isKeyDown_ || this.isTouched_ || this.isClicked_;
}

ControllerButton.prototype.setKeyDown = function(isKeyDown) {
	this.isKeyDown_ = isKeyDown;
}

ControllerButton.prototype.setTouched = function(isTouched) {
	this.isTouched_ = isTouched;
}

ControllerButton.prototype.testPoint = function(x, y) {
	return this.area_.containsxy(x, y);
}


// Controller

Controller = {};

Controller.Left = 0;
Controller.Right = 1;
Controller.Jump = 2;
Controller.Duck = 3;

Controller.buttons_ = [];

Controller.isPressed = function(button) {
	return this.buttons_[button].isPressed();
}

Controller.keyboardChanged = function(key, isKeyDown) {
	var button = null;

	switch (key) {
		case Keyboard.Left:
			button = Controller.Left;
			break;

		case Keyboard.Right:
			button = Controller.Right;
			break;

		case Keyboard.Up:
			button = Controller.Jump;
			break;

		case Keyboard.Down:
			button = Controller.Duck;
			break;

		default:
			return;
	}

	this.buttons_[button].setKeyDown(isKeyDown ? true : false);
}

Controller.touchChanged = function(touches) {
	for (var iButton = this.buttons_.length - 1; iButton >= 0; iButton--) {
		var button = this.buttons_[iButton];
		var touched = false;

		for (var iTouch = touches.length - 1; iTouch >= 0; iTouch--) {
			var touch = touches[iTouch];

			if (button.testPoint(touch.pageX, touch.pageY)) {
				touched = true;
			}
		}

		button.setTouched(touched);
	}
}

Controller.initialize = function() {
	this.buttons_.lenght = 3;
	this.buttons_[Controller.Left]  = new ControllerButton();
	this.buttons_[Controller.Right] = new ControllerButton();
	this.buttons_[Controller.Jump]  = new ControllerButton();
	this.buttons_[Controller.Duck]  = new ControllerButton();

	/*this.buttons_[Controller.Left].setImage(Resources.images["controller"], new Rectangle(0, 0, 64, 64));
	this.buttons_[Controller.Right].setImage(Resources.images["controller"], new Rectangle(64, 0, 64, 64));
	this.buttons_[Controller.Jump].setImage(Resources.images["controller"], new Rectangle(128, 0, 64, 64));*/

	Keyboard.bind(this, function(key, isKeyDown) {
		Controller.keyboardChanged.call(Controller, key, isKeyDown);
	});

	$(document).bind("touchstart touchmove touchend touchcancel", function(e) {
		e.preventDefault();
		//Controller.touchChanged.call(Controller, e.touches);
		Controller.touchChanged(e.originalEvent.touches);
	});
}

Controller.updateViewSize = function(viewSize) {
	/*this.buttons_[Controller.Left].setPosition(10, viewSize.y - 74);
	this.buttons_[Controller.Right].setPosition(74, viewSize.y - 74);
	this.buttons_[Controller.Jump].setPosition(viewSize.x - 74, viewSize.y - 74);*/

	this.buttons_[Controller.Left].setArea(0, viewSize.y / 2, viewSize.x / 4, viewSize.y / 2);
	this.buttons_[Controller.Right].setArea(viewSize.x / 4, viewSize.y / 2, viewSize.x / 4, viewSize.y / 2);
	this.buttons_[Controller.Jump].setArea(viewSize.x / 2, 0, viewSize.x / 2, viewSize.y / 2);
	this.buttons_[Controller.Duck].setArea(viewSize.x / 2, viewSize.y / 2, viewSize.x / 2, viewSize.y / 2);
}

Controller.draw = function(context) {
	for (var i = this.buttons_.length - 1; i >= 0; i--) {
		this.buttons_[i].draw(context);
	}
}

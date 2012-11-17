function Map() {
	this.tileSize_ = new Vector2(32, 32);
	this.size_ = new Vector2();
	this.tiles_ = [];
}

Map.prototype.load = function(name) {
	var image = Resources.images[name];
	this.size_.assign(image.width, image.height);
	this.tiles_.length = image.width * image.height;

	var renderTarget = new RenderTarget();
	renderTarget.create(image.width, image.height);

	var context = renderTarget.getContext();
	context.drawImage(image, 0, 0);

	var imageData = context.getImageData(0, 0, image.width, image.height);
	var color = new Color();

	for (var x = 0; x < image.width; x++) {
		for (var y = 0; y < image.height; y++) {
			color.r = imageData.data[4 * (x + y * image.width) + 0];
			color.g = imageData.data[4 * (x + y * image.width) + 1];
			color.b = imageData.data[4 * (x + y * image.width) + 2];
			color.a = imageData.data[4 * (x + y * image.width) + 3];

			this.tiles_[x + y * image.width] = {
				solid: color.equals(Color.Black)
			}
		}
	}
}

Map.prototype.draw = function(context, viewRect) {
	var texture = Resources.images["mapTexture"];
	var pattern = context.createPattern(texture, "repeat");

	context.save();
	context.fillStyle = pattern;

	var x0 = Math.max(0, Math.floor(viewRect.left / this.tileSize_.x));
	var y0 = Math.max(0, Math.floor(viewRect.top / this.tileSize_.y));
	var x1 = Math.min(this.size_.x - 1, Math.floor((viewRect.left + viewRect.width) / this.tileSize_.x));
	var y1 = Math.min(this.size_.y - 1, Math.floor((viewRect.top + viewRect.height) / this.tileSize_.y));

	for (var x = x0; x <= x1; x++) {
		for (var y = y0; y <= y1; y++) {
			if (this.tiles_[x + y * this.size_.x].solid) {
				context.fillRect(x * this.tileSize_.x, y * this.tileSize_.y, this.tileSize_.x, this.tileSize_.y);
			}
		}
	}

	context.restore();
}

Map.prototype.isTileSolid = function(x, y) {
	return this.tiles_[x + y * this.size_.x].solid;
}

Map.prototype.checkCollision = function(rc) {
	if (!this.checkCollisionVars_) {
		this.checkCollisionVars_ = {
			rcTile: new Rectangle()
		}
	}

	var x0 = Math.floor(rc.left / this.tileSize_.x);
	var y0 = Math.floor(rc.top / this.tileSize_.y);
	var x1 = Math.floor((rc.left + rc.width) / this.tileSize_.x);
	var y1 = Math.floor((rc.top + rc.height) / this.tileSize_.y);

	var rcTile = this.checkCollisionVars_.rcTile;
	rcTile.assign(0, 0, this.tileSize_.x, this.tileSize_.y);

	for (var x = x0; x <= x1; x++) {
		for (var y = y0; y <= y1; y++) {
			rcTile.left = x * this.tileSize_.x;
			rcTile.top = y * this.tileSize_.y;

			if (x >= 0 && y >= 0 && x < (this.size_.x) && y < (this.size_.y)) {
				if (this.isTileSolid(x, y) && rc.intersects(rcTile)) {
					return true;
				}
			}
			else if (rc.intersects(rcTile)) {
				return true;
			}
		}
	}

	return false;
}

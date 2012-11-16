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

Map.prototype.draw = function(context) {
	var texture = Resources.images["mapTexture"];
	var pattern = context.createPattern(texture, "repeat");

	context.save();
	context.fillStyle = pattern;

	for (var x = 0; x < this.size_.x; x++) {
		for (var y = 0; y < this.size_.y; y++) {
			var solid = this.tiles_[x + y * this.size_.x].solid;

			if (solid) {
				context.fillRect(x * this.tileSize_.x, y * this.tileSize_.y, this.tileSize_.x, this.tileSize_.y);
			}
		}
	}

	context.restore();
}

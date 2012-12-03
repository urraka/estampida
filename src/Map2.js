function Map2() {
	this.lineStrips = [
		[
			new Vector2(20, 450),
			new Vector2(100, 500),
			new Vector2(200, 450),
			new Vector2(300, 500),
			new Vector2(350, 540),
			new Vector2(500, 580),
			new Vector2(600, 500),
			new Vector2(650, 500),
			new Vector2(600, 200),
			new Vector2(200, 300),
			new Vector2(20, 450)
		]
	];
}

Map2.prototype.checkCollision = function(rc) {
	for (var i = this.lineStrips.length - 1; i >= 0; i--) {
		var lineStrip = this.lineStrips[i];

		for (var j = this.lineStrips[i].length - 1; j > 0; j--) {
			if (rc.intersectsLine(lineStrip[j - 1], lineStrip[j])) {
				return true;
			}
		}
	}

	return false;
}

Map2.prototype.draw = function(context) {
	var texture = Resources.images["mapTexture"];
	var pattern = context.createPattern(texture, "repeat");

	var line = new Line();
	var midpoint = new Vector2();
	//var rc = new Rectangle();
	//var bounds = new Rectangle(this.lineStrips[0][0].x, this.lineStrips[0][0].y, 0, 0);

	context.save();

	context.strokeStyle = "#000";
	context.lineWidth = 1;

	for (var i = this.lineStrips.length - 1; i >= 0; i--) {
		var lineStrip = this.lineStrips[i];
		var L = lineStrip.length;

		if (L == 0) continue;

		context.beginPath();
		context.moveTo(lineStrip[0].x, lineStrip[0].y);

		for (var j = 1; j < L; j++)
			context.lineTo(lineStrip[j].x, lineStrip[j].y);

		context.stroke();

		for (var j = lineStrip.length - 1; j > 0; j--) {
			line.assignp(lineStrip[j], lineStrip[j - 1]);
			line.midpoint(midpoint);
			line.normal.multiply(5).addv(midpoint);

			context.beginPath();
			context.moveTo(midpoint.x, midpoint.y);
			context.lineTo(line.normal.x, line.normal.y);
			context.stroke();

			//line.getBounds(rc);
			//bounds.expand(rc);
			//context.strokeRect(rc.left, rc.top, rc.width, rc.height);
		}
	}

	//context.strokeStyle = "#FFF";
	//context.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);

	context.restore();
}

Physics = {};

Physics.Result = function() {
	this.position = new Vector2();
	this.collisionSegment = new Line();
}

Physics.move = function(map, object, dest, result) {
	if (!this.moveVars_) {
		this.moveVars_ = {
			pathLine: new Line(),
			point: new Vector2(),
			line: new Line()
		};
	}

	result.position.assignv(dest);
	result.collisionSegment.p1.assignxy(0, 0);
	result.collisionSegment.p2.assignxy(0, 0);

	var currentPercent = 1;
	var objectPosition = object.getPosition();
	var pathLine = this.moveVars_.pathLine.assignp(objectPosition, dest);
	var oppositeDirectionAngle = Math.PI + this.moveVars_.point.assignv(dest).subtractv(objectPosition).normalize().angle();

	// TODO: this has to be optimized so that the lines have their normals pre-calculated and so we only check relevant lines (search: BSP tree)
	for (var i = map.lineStrips.length - 1; i >= 0; i--) {
		var lineStrip = map.lineStrips[i];

		for (var j = lineStrip.length - 1; j > 0; j--) {
			// line to test collision against
			var line = this.moveVars_.line.assignp(lineStrip[j], lineStrip[j - 1]);

			// skip collision check if object is not moving towards the line
			if (object.getVelocity().dotv(line.normal) > 0)
				continue;

			// TODO: do the actual box collision

			// if there is no interection with the line skip to the next line
			var point = line.intersection(pathLine, this.moveVars_.point);
			if (point === null)
				continue;

			// maybe this can be replaced with some if
			var percentX = (point.x - objectPosition.x) / (dest.x - objectPosition.x);
			var percentY = (point.y - objectPosition.y) / (dest.y - objectPosition.y);
			var percent = (isNaN(percentX) || !isFinite(percentX)) ? percentY : percentX;

			if (percent < currentPercent) {
				result.position.x = objectPosition.x + (dest.x - objectPosition.x) * percent;
				result.position.y = objectPosition.y + (dest.y - objectPosition.y) * percent;
				
				// go back kEpsilon to avoid floating point errors
				result.position.x += Math.cos(oppositeDirectionAngle) * kEpsilon;
				result.position.y += Math.sin(oppositeDirectionAngle) * kEpsilon;
				
				currentPercent = percent;
				result.collisionSegment.assignl(line);
			}
		}
	}
}

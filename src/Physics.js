Physics = {};

Physics.kMaxFloorSlope = 5;

// Physics.WorldLine : Line

Physics.WorldLine = function(p1, p2) {
	Line.call(this, p1, p2);
	this.previous = null;
	this.next = null;
	this.isFloor = false;
	this.slope = this.slope();
	this.flag = false; // if flagged color will change (for debugging)
	this.active = false; // to show which lines are being tested for collision (for debugging)
}

Physics.WorldLine.prototype = new Line();

// Physics.MoveResult

Physics.MoveResult = function() {
	this.position = new Vector2();
	this.collisionLine = null;
	this.percent = 0;
}

// Physics.World

Physics.World = function(bounds) {
	this.quadTrees_ = [];
	this.lineStrips_ = [];
	this.bounds_ = new Rectangle(bounds);

	// Line highlight modes:
	//   0 = all retrieved from quadtree
	//   1 = skip out of bounds
	//   2 = skip out of bounds and opposite direction
	//   3 = only intersected
	this.linesHighlightMode_ = 0;
	this.activeLines_ = [];

	var blockSize = 100; // desired size of tree sub-divisions (approximate value)
	var maxChildren = 5;
	var n, horizontal, quadsSize, maxDepth;

	if (bounds.width > bounds.height) {
		n = Math.ceil(bounds.width / bounds.height);
		quadsSize = bounds.height;
		horizontal = true;
	}
	else {
		n = Math.ceil(bounds.height / bounds.width);
		quadsSize = bounds.width;
		horizontal = false;
	}

	maxDepth = Math.round(Math.log(quadsSize / blockSize) / Math.LN2);

	this.quadTrees_.length = n;
	bounds.width = quadsSize;
	bounds.height = quadsSize;

	for (var i = 0; i < n; i++) {
		this.quadTrees_[i] = new QuadTree(bounds, Physics.World.itemBelongsToRect_, maxDepth, maxChildren);

		if (horizontal)
			bounds.left += quadsSize;
		else
			bounds.top += quadsSize;
	}
}

Physics.World.prototype.locals_ = {};

Physics.World.itemBelongsToRect_ = function(item, bounds) {
	return bounds.intersectsLine(item.p1, item.p2);
}

Physics.World.prototype.getTreeIndexMin_ = function(bounds) {
	if (this.bounds_.width > this.bounds_.height)
		return Math.max(0, Math.floor((bounds.left - this.bounds_.left) / this.bounds_.height));
	else
		return Math.max(0, Math.floor((bounds.top - this.bounds_.top) / this.bounds_.width));
}

Physics.World.prototype.getTreeIndexMax_ = function(bounds) {
	if (this.bounds_.width > this.bounds_.height)
		return Math.min(this.quadTrees_.length - 1, Math.floor((bounds.left + bounds.width - this.bounds_.left) / this.bounds_.height));
	else
		return Math.min(this.quadTrees_.length - 1, Math.floor((bounds.top + bounds.height - this.bounds_.top) / this.bounds_.width));
}

Physics.World.prototype.addLineStrip = function(points) {
	var locals = this.locals_.addLineStrip || (this.locals_.addLineStrip = {
		rc: new Rectangle(),
		vi: new Vector2(0, -1)
	});

	if (points.length <= 1)
		return;

	var locals = this.locals_.addLineStrip;
	var nPoints = points.length;
	var currentLine = null;
	var firstLine = null;
	var prevLine = null;

	for (var i = 0; i < nPoints - 1; i++) {
		currentLine = new Physics.WorldLine(points[i], points[i + 1]);
		currentLine.isFloor = Math.abs(currentLine.slope) <= Physics.kMaxFloorSlope && currentLine.normal.dot(locals.vi) > 0;

		if (firstLine === null)
			firstLine = currentLine;

		if (prevLine) {
			prevLine.next = currentLine;
			currentLine.previous = prevLine;
		}

		prevLine = currentLine;

		// add to quadTrees

		var rc = currentLine.getBounds(locals.rc);
		var iTreeMin = this.getTreeIndexMin_(rc);
		var iTreeMax = this.getTreeIndexMax_(rc);

		for (var j = iTreeMin; j <= iTreeMax; j++)
			this.quadTrees_[j].insert(currentLine);
	}

	// if the line strip is closed connect its ends

	if (currentLine.p2.equals(firstLine.p1)) {
		firstLine.previous = currentLine;
		currentLine.next = firstLine;
	}

	this.lineStrips_.push(firstLine);
}

Physics.World.prototype.moveObject = function(object, dest, result) {
	var locals = this.locals_.moveObject || (this.locals_.moveObject = {
		lines: [],
		pathLine: new Line(),
		point: new Vector2(),
		rc: new Rectangle(),
		bounds: new Rectangle()
	});

	// default result
	result.position.assignv(dest);
	result.collisionLine = null;
	result.percent = 1;

	var objectPosition = object.getPosition();
	var bounds = locals.bounds;

	object.getBoundingRect(objectPosition, bounds);
	object.getBoundingRect(dest, locals.rc);
	bounds.expand(locals.rc);

	var nLines = 0;
	var lines = locals.lines;
	var iTreeMin = this.getTreeIndexMin_(bounds);
	var iTreeMax = this.getTreeIndexMax_(bounds);

	lines.length = 0;

	for (var i = iTreeMin; i <= iTreeMax; i++)
		this.quadTrees_[i].retrieve(bounds, lines);

	nLines = lines.length;

	if (nLines === 0)
		return;

	var pathLine = locals.pathLine.assignp(objectPosition, dest);
	var invAngle = Math.PI + locals.point.assignv(dest).subtractv(objectPosition).normalize().angle();

	for (var i = lines.length - 1; i >= 0; i--) {
		var line = lines[i];

		this.activeLines_.push(line);

		if (this.linesHighlightMode_ === 0)
			line.active = true;

		var lineBounds = line.getBounds(locals.rc);
		if (!lineBounds.intersects(bounds))
			continue;

		if (this.linesHighlightMode_ === 1)
			line.active = true;

		// skip collision check if object is not moving towards the line
		var direction = locals.point.assignv(dest).subtractv(objectPosition);
		if (direction.dotv(line.normal) > 0)
			continue;

		if (this.linesHighlightMode_ === 2)
			line.active = true;

		// TODO: do the collision hulls calculation...

		// if there is no intersection with the line skip to the next line
		var point = line.intersection(pathLine, locals.point);
		if (point === null)
			continue;

		if (this.linesHighlightMode_ === 3)
			line.active = true;

		var percent = 0;
		var dx = dest.x - objectPosition.x;
		var dy = dest.y - objectPosition.y;

		if (Math.abs(dx) > Math.abs(dy))
			percent = (point.x - objectPosition.x) / dx;
		else
			percent = (point.y - objectPosition.y) / dy;

		if (percent < result.percent) {
			result.position.x = objectPosition.x + (dest.x - objectPosition.x) * percent;
			result.position.y = objectPosition.y + (dest.y - objectPosition.y) * percent;
			
			// go back kEpsilon to avoid floating point errors
			result.position.x += Math.cos(invAngle) * kEpsilon;
			result.position.y += Math.sin(invAngle) * kEpsilon;
			
			result.percent = percent;
			result.collisionLine = line;
		}
	}
}

Physics.World.prototype.draw = function(context) {
	var locals = this.locals_.draw || (this.locals_.draw = {
		bounds: new Rectangle(),
		midpoint: new Vector2()
	});

	context.save();
	context.lineWidth = 2;

	for (var i = this.lineStrips_.length - 1; i >= 0; i--) {

		var first = this.lineStrips_[i];
		var current = first;

		while (current) {
			var color = "#999";

			if (current.active && current.isFloor)
				color = "#060";
			else if (current.active)
				color = "#000";
			else if (current.isFloor)
				color = "#595";

			context.strokeStyle = color;

			if (current.flag) {
				context.shadowBlur = 10;
				context.shadowColor = "#000";
				context.beginPath();
				context.moveTo(Math.floor(current.p1.x), Math.floor(current.p1.y));
				context.lineTo(Math.floor(current.p2.x), Math.floor(current.p2.y));
				context.stroke();
				context.shadowBlur = 0;
			}

			current.midpoint(locals.midpoint);

			context.beginPath();
			context.moveTo(Math.floor(locals.midpoint.x), Math.floor(locals.midpoint.y));
			context.lineTo(Math.floor(locals.midpoint.x + current.normal.x * 10), Math.floor(locals.midpoint.y + current.normal.y * 10));
			context.stroke();

			context.beginPath();
			context.moveTo(Math.floor(current.p1.x), Math.floor(current.p1.y));
			context.lineTo(Math.floor(current.p2.x), Math.floor(current.p2.y));
			context.stroke();

			if (current.next !== first)
				current = current.next;
			else
				current = null;
		}
	}

	// draw quad trees

	var len = this.quadTrees_.length;

	if (len > 0) {
		context.strokeStyle = "rgba(0,0,0,0.5)";
		context.lineWidth = 1;

		for (var i = 0; i < len; i++) {
			this.drawQuadTreeNode(context, this.quadTrees_[i].root_);

			if (i === 0)
				locals.bounds.assign(this.quadTrees_[i].root_.bounds_);
			else
				locals.bounds.expand(this.quadTrees_[i].root_.bounds_);

			if (i < len - 1) {
				var bounds = this.quadTrees_[i].root_.bounds_;

				context.beginPath();
	
				if (this.bounds_.width > this.bounds_.height) {
					context.moveTo(Math.floor(bounds.left + bounds.width) + 0.5, Math.floor(bounds.top));
					context.lineTo(Math.floor(bounds.left + bounds.width) + 0.5, Math.floor(bounds.top + bounds.height));
				}
				else {
					context.moveTo(Math.floor(bounds.left), Math.floor(bounds.top + bounds.height) + 0.5);
					context.lineTo(Math.floor(bounds.left + bounds.width), Math.floor(bounds.top + bounds.height) + 0.5);
				}
	
				context.stroke();
			}
		}

		context.strokeRect(Math.floor(locals.bounds.left) + 0.5, Math.floor(locals.bounds.top) + 0.5, Math.floor(locals.bounds.width), Math.floor(locals.bounds.height));
	}

	context.restore();

	// clear active lines

	for (var i = this.activeLines_.length - 1; i >= 0; i--) {
		this.activeLines_[i].active = false;
	}

	this.activeLines_.length = 0;
}

Physics.World.prototype.drawQuadTreeNode = function(context, node) {
	if (node.subdivided_) {
		context.beginPath();
		context.moveTo(Math.floor(node.bounds_.left + node.bounds_.width / 2) + 0.5, Math.floor(node.bounds_.top));
		context.lineTo(Math.floor(node.bounds_.left + node.bounds_.width / 2) + 0.5, Math.floor(node.bounds_.top + node.bounds_.height));
		context.stroke();

		context.beginPath();
		context.moveTo(Math.floor(node.bounds_.left ), Math.floor(node.bounds_.top + node.bounds_.height / 2) + 0.5);
		context.lineTo(Math.floor(node.bounds_.left + node.bounds_.width), Math.floor(node.bounds_.top + node.bounds_.height / 2) + 0.5);
		context.stroke();

		this.drawQuadTreeNode(context, node.nodes_.topLeft);
		this.drawQuadTreeNode(context, node.nodes_.topRight);
		this.drawQuadTreeNode(context, node.nodes_.bottomLeft);
		this.drawQuadTreeNode(context, node.nodes_.bottomRight);
	}
}

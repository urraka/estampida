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
	this.quadTreeArray_ = null;
	this.lineStrips_ = [];
	this.bounds_ = new Rectangle(bounds);

	// Line highlight modes:
	//   0 = all retrieved from quadtree
	//   1 = skip out of bounds
	//   2 = skip out of bounds and opposite direction
	//   3 = only intersected
	this.linesHighlightMode_ = 0;
	this.showCollisionHull_ = true;
	this.activeLines_ = [];

	var blockSize = 100;
	var maxChildren = 5;
	var maxDepth = Math.round(Math.log(Math.min(bounds.width, bounds.height) / blockSize) / Math.LN2);
	var itemCallbacks = Physics.World.QuadTreeItemCallbacks;

	this.quadTreeArray_ = new QuadTreeArray(bounds, itemCallbacks, maxDepth, maxChildren);
}

Physics.World.prototype.locals_ = {};

Physics.World.QuadTreeItemCallbacks = {
	intersectsRect: function(item, bounds) { return bounds.intersectsLine(item.p1, item.p2); },
	getBounds: function(item, result) { return item.getBounds(result); }
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

		this.quadTreeArray_.insert(currentLine);
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
		bounds: new Rectangle(),
		hull: {
			line: new Line(),
			line1: new Line(),
			line2: new Line()
		}
	});

	// default result
	result.position.assignv(dest);
	result.collisionLine = null;
	result.percent = 1;

	var objectPosition = object.getPosition();
	var bounds = locals.bounds;
	var lines = locals.lines;

	lines.length = 0;

	object.getBoundingRect(objectPosition, bounds);
	object.getBoundingRect(dest, locals.rc);
	bounds.expand(locals.rc);

	this.quadTreeArray_.retrieve(bounds, lines);

	var nLines = lines.length;

	if (nLines === 0)
		return;

	var pathLine = locals.pathLine.assignp(objectPosition, dest);
	var invAngle = Math.PI + locals.point.assignv(dest).subtractv(objectPosition).normalize().angle();

	for (var i = 0; i < nLines; i++) {
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
		var hull = this.createLineHull(object, line, locals.hull);

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

Physics.World.prototype.createLineHull = function(object, line, hull) {
	var locals = this.locals_.createLineHull || (this.locals_.createLineHull = {
		rc: new Rectangle(),
		pos: new Vector2(),
		offset: { l: 0, r: 0, t: 0, b: 0 }
	});

	var realLine = line;
	var line = hull.line.assignl(line);
	var line1 = hull.line1;
	var line2 = hull.line2;

	line1.p1.assignxy(0, 0);
	line1.p2.assignxy(0, 0);
	line2.p1.assignxy(0, 0);
	line2.p2.assignxy(0, 0);

	var offset = locals.offset;
	var rc = object.getBoundingRect(locals.pos.assignxy(0, 0), locals.rc);

	offset.l = rc.left;
	offset.r = rc.left + rc.width;
	offset.t = -rc.top;
	offset.b = -(rc.top + rc.height);

	if (realLine.isFloor) {
		if (!realLine.previous || !realLine.previous.isFloor) {
			line1.p1.assignxy(line.p1.x + offset.r, line.p1.y);
			line1.p2.assignxy(line.p1.x, line.p1.y);
			line1.calculateNormal();
		}

		if (!realLine.next || !realLine.next.isFloor) {
			line2.p1.assignxy(line.p2.x, line.p2.y);
			line2.p2.assignxy(line.p2.x + offset.l, line.p2.y);
			line2.calculateNormal();
		}
	}
	else {
		if (line.normal.y === 1) {
			line.p1.addxy(offset.l, offset.t);
			line.p2.addxy(offset.r, offset.t);
			line1.p1.assignxy(line.p1.x, line.p1.y - rc.height);
			line1.p2.assignxy(line.p1.x, line.p1.y);
			line2.p1.assignxy(line.p2.x, line.p2.y);
			line2.p2.assignxy(line.p2.x, line.p2.y - rc.height);
		}
		else if (line.normal.y === -1) {
			line.p1.addxy(offset.r, offset.b);
			line.p2.addxy(offset.l, offset.b);
			line1.p1.assignxy(line.p1.x, line.p1.y + rc.height);
			line1.p2.assignxy(line.p1.x, line.p1.y);
			line2.p1.assignxy(line.p2.x, line.p2.y);
			line2.p2.assignxy(line.p2.x, line.p2.y + rc.height);
		}
		else if (line.normal.x === 1) {
			line.p1.addxy(offset.r, offset.t);
			line.p2.addxy(offset.r, offset.b);
			line1.p1.assignxy(line.p1.x - rc.width, line.p1.y);
			line1.p2.assignxy(line.p1.x, line.p1.y);
			line2.p1.assignxy(line.p2.x, line.p2.y);
			line2.p2.assignxy(line.p2.x - rc.width, line.p2.y);
		}
		else if (line.normal.x === -1) {
			line.p1.addxy(offset.l, offset.b);
			line.p2.addxy(offset.l, offset.t);
			line1.p1.assignxy(line.p1.x + rc.width, line.p1.y);
			line1.p2.assignxy(line.p1.x, line.p1.y);
			line2.p1.assignxy(line.p2.x, line.p2.y);
			line2.p2.assignxy(line.p2.x + rc.width, line.p2.y);
		}
		else {
			var dx = line.normal.x > 0 ? offset.r : offset.l;
			var dy = line.normal.y > 0 ? offset.t : offset.b;

			line.p1.addxy(dx, dy);
			line.p2.addxy(dx, dy);

			if (line.normal.x > 0 && line.normal.y > 0) {
				line1.p1.assignxy(line.p1.x - rc.width, line.p1.y);
				line1.p2.assignxy(line.p1.x, line.p1.y);
				line2.p1.assignxy(line.p2.x, line.p2.y);
				line2.p2.assignxy(line.p2.x, line.p2.y - rc.height);
			}
			else if (line.normal.x < 0 && line.normal.y < 0) {
				line1.p1.assignxy(line.p1.x + rc.width, line.p1.y);
				line1.p2.assignxy(line.p1.x, line.p1.y);
				line2.p1.assignxy(line.p2.x, line.p2.y);
				line2.p2.assignxy(line.p2.x, line.p2.y + rc.height);
			}
			else if (line.normal.x < 0 && line.normal.y > 0) {
				line1.p1.assignxy(line.p2.x, line.p2.y);
				line1.p2.assignxy(line.p2.x + rc.width, line.p2.y);
				line2.p1.assignxy(line.p1.x, line.p1.y - rc.height);
				line2.p2.assignxy(line.p1.x, line.p1.y);
			}
			else {
				line1.p1.assignxy(line.p2.x, line.p2.y);
				line1.p2.assignxy(line.p2.x - rc.width, line.p2.y);
				line2.p1.assignxy(line.p1.x, line.p1.y + rc.height);
				line2.p2.assignxy(line.p1.x, line.p1.y);
			}
		}

		line1.calculateNormal();
		line2.calculateNormal();
	}

	return hull;
}

Physics.World.prototype.draw = function(context, object) {
	var locals = this.locals_.draw || (this.locals_.draw = {
		bounds: new Rectangle(),
		midpoint: new Vector2(),
		hull: {
			line: new Line(),
			line1: new Line(),
			line2: new Line()
		}
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

			// shadow
			if (current.flag) {
				context.shadowBlur = 10;
				context.shadowColor = "#000";
				context.beginPath();
				context.moveTo(Math.floor(current.p1.x), Math.floor(current.p1.y));
				context.lineTo(Math.floor(current.p2.x), Math.floor(current.p2.y));
				context.stroke();
				context.shadowBlur = 0;
			}

			// normal
			current.midpoint(locals.midpoint);

			context.beginPath();
			context.moveTo(Math.floor(locals.midpoint.x), Math.floor(locals.midpoint.y));
			context.lineTo(Math.floor(locals.midpoint.x + current.normal.x * 10), Math.floor(locals.midpoint.y + current.normal.y * 10));
			context.stroke();

			// line
			context.beginPath();
			context.moveTo(Math.floor(current.p1.x), Math.floor(current.p1.y));
			context.lineTo(Math.floor(current.p2.x), Math.floor(current.p2.y));
			context.stroke();

			// hull
			if (object && this.showCollisionHull_ && current.active) {
				var hull = this.createLineHull(object, current, locals.hull);

				context.lineWidth = 1;
				context.strokeStyle = "rgba(0,0,255,0.4)";

				context.beginPath();
				context.moveTo(Math.floor(hull.line.p1.x), Math.floor(hull.line.p1.y));
				context.lineTo(Math.floor(hull.line.p2.x), Math.floor(hull.line.p2.y));
				context.stroke();

				if (hull.line1.hasLength()) {
					context.beginPath();
					context.moveTo(Math.floor(hull.line1.p1.x), Math.floor(hull.line1.p1.y));
					context.lineTo(Math.floor(hull.line1.p2.x), Math.floor(hull.line1.p2.y));
					context.stroke();
				}

				if (hull.line2.hasLength()) {
					context.beginPath();
					context.moveTo(Math.floor(hull.line2.p1.x), Math.floor(hull.line2.p1.y));
					context.lineTo(Math.floor(hull.line2.p2.x), Math.floor(hull.line2.p2.y));
					context.stroke();
				}

				context.lineWidth = 2;
			}

			if (current.next !== first)
				current = current.next;
			else
				current = null;
		}
	}

	// draw quad trees

	var quadTrees = this.quadTreeArray_.quadTrees_;
	var len = quadTrees.length;

	if (len > 0) {
		context.strokeStyle = "rgba(0,0,0,0.5)";
		context.lineWidth = 1;

		for (var i = 0; i < len; i++) {
			this.drawQuadTreeNode(context, quadTrees[i].root_);

			if (i === 0)
				locals.bounds.assign(quadTrees[i].root_.bounds_);
			else
				locals.bounds.expand(quadTrees[i].root_.bounds_);

			if (i < len - 1) {
				var bounds = quadTrees[i].root_.bounds_;

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

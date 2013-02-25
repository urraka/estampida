Physics = {};

Physics.kMaxFloorSlope = 2;

// Physics.WorldLine : Line

/**
 * @constructor
 * Extended line which can be connected with a previous/next line.
 * @param {Vector2} p1 Start point.
 * @param {Vector2} p2 End point.
 */
Physics.WorldLine = function(p1, p2) {
	Line.call(this, p1, p2);
	this.previous = null;
	this.next = null;
	this.isFloor = false;

	this.flag = false; // if flagged color will change (for debugging)
	this.active = false; // to show which lines are being tested for collision (for debugging)
};

Physics.WorldLine.prototype = new Line();

Physics.WorldLine.prototype.assignl = function(worldLine) {
	Line.prototype.assignl.call(this, worldLine);
	this.previous = worldLine.previous;
	this.next = worldLine.next;
	this.isFloor = worldLine.isFloor;
	return this;
};

// Physics.LineHull

Physics.LineHull = function(lineHull) {
	this.line = new Physics.WorldLine();
	this.line1 = new Physics.WorldLine();
	this.line2 = new Physics.WorldLine();
	this.realLine = null;

	if (lineHull)
		this.assign(lineHull);
};

Physics.LineHull.prototype.assign = function(lineHull) {
	this.line.assignl(lineHull.line);
	this.line1.assignl(lineHull.line1);
	this.line2.assignl(lineHull.line2);
	this.realLine = lineHull.realLine;

	this.line1.next = this.line;
	this.line2.previous = this.line;

	if (lineHull.line.previous === lineHull.line1)
		this.line.previous = this.line1;

	if (lineHull.line.next === lineHull.line2)
		this.line.next = this.line2;

	return this;
};

Physics.LineHull.prototype.getLine = function(index) {
	switch (index) {
		case 0: return this.line;
		case 1: return this.line1;
		case 2: return this.line2;
		default: return null;
	}
};

// Physics.MoveResult

Physics.MoveResult = function() {
	this.position = new Vector2();
	this.collisionLineIndex = -1;
	this.collisionHull = new Physics.LineHull();
	this.percent = 0;
};

// Physics.World

/**
 * @constructor
 * Physics world for handling collisions.
 * @param {Rectangle} bounds Bounding rectangle of the world.
 */
Physics.World = function(bounds) {
	this.quadTreeArray_ = null;
	this.lineStrips_ = [];
	this.bounds_ = new Rectangle(bounds);

	// for debugging
	this.showCollisionHull_ = true;
	this.activeLines_ = [];

	var blockSize = 100;
	var maxChildren = 5;
	var maxDepth = Math.round(Math.log(Math.min(bounds.width, bounds.height) / blockSize) / Math.LN2);
	var itemCallbacks = Physics.World.QuadTreeItemCallbacks;

	this.quadTreeArray_ = new QuadTreeArray(bounds, itemCallbacks, maxDepth, maxChildren);
};

Physics.World.prototype.locals_ = {};

Physics.World.QuadTreeItemCallbacks = {
	intersectsRect: function(item, bounds) { return bounds.intersectsLine(item.p1, item.p2); },
	getBounds: function(item, result) { return item.getBounds(result); }
};

Physics.World.prototype.addLineStrip = function(points) {
	var locals = this.locals_.addLineStrip || (this.locals_.addLineStrip = {
		rc: new Rectangle()
	});

	if (points.length <= 1)
		return;

	var nPoints = points.length;
	var currentLine = null;
	var firstLine = null;
	var prevLine = null;

	for (var i = 0; i < nPoints - 1; i++) {
		currentLine = new Physics.WorldLine(points[i], points[i + 1]);
		currentLine.isFloor = Math.abs(currentLine.slope()) <= Physics.kMaxFloorSlope && currentLine.normal.dotxy(0, -1) > 0;

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
};

/**
 * Performs a collision test for a given object moving to a destination position.
 * @param  {GameObject} object Object to test for collision.
 * @param  {Vector2} dest   Destination position.
 * @param  {Physics.MoveResult} result Object where to store the result.
 */
Physics.World.prototype.moveObject = function(object, dest, result) {
	var locals = this.locals_.moveObject || (this.locals_.moveObject = {
		lines: [],
		pathLine: new Line(),
		point: new Vector2(),
		rc: new Rectangle(),
		bounds: new Rectangle(),
		hull: new Physics.LineHull(),
		hullLines: [null, null, null]
	});

	// default result (no collision)
	result.position.assignv(dest);
	result.collisionLineIndex = -1;
	result.percent = 1;

	var objectPosition = object.getPosition();
	var bounds = locals.bounds;

	object.getBoundingRect(objectPosition, bounds);
	object.getBoundingRect(dest, locals.rc);
	bounds.expand(locals.rc);

	locals.lines.length = 0;
	var lines = this.quadTreeArray_.retrieve(bounds, locals.lines);

	var nLines = lines.length;

	if (nLines === 0)
		return;

	var pathLine = locals.pathLine.assignp(objectPosition, dest);
	var direction = locals.point.assignv(dest).subtractv(objectPosition);
	var invAngle = Math.PI + locals.point.assignv(dest).subtractv(objectPosition).normalize().angle();

	for (var i = 0; i < nLines; i++) {
		var line = lines[i];

		line.active = true;
		this.activeLines_.push(line);

		var lineBounds = line.getBounds(locals.rc);
		if (!lineBounds.intersects(bounds))
			continue;

		var hull = this.createLineHull(object, line, locals.hull);
		var hullLines = locals.hullLines;

		hullLines[0] = hull.line;
		hullLines[1] = hull.line1;
		hullLines[2] = hull.line2;

		for (var iHullLine = 0; iHullLine < 3; iHullLine++) {
			var hullLine = hullLines[iHullLine];

			// this will be true for floor lines which don't have line1/line2
			if (!hullLine.hasLength())
				continue;

			// skip collision check if object is not moving towards the line
			if (direction.dotv(hullLine.normal) > 0)
				continue;

			var point = hullLine.intersection(pathLine, locals.point);

			if (point === null)
				continue;

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

				result.percent = percent;
				result.collisionHull.assign(hull);
				result.collisionLineIndex = iHullLine;

				var squareMagnitude = locals.point.assignv(result.position).subtractv(objectPosition).dotv(locals.point);

				if (squareMagnitude < kEpsilon * kEpsilon) {
					result.percent = 0;
					result.position.assignv(objectPosition);
					return;
				}
				else {
					result.position.x += Math.cos(invAngle) * kEpsilon;
					result.position.y += Math.sin(invAngle) * kEpsilon;
				}
			}
		}
	}
};

Physics.World.prototype.createLineHull = function(object, line, hull) {
	var locals = this.locals_.createLineHull || (this.locals_.createLineHull = {
		rc: new Rectangle(),
		pos: new Vector2(),
		offset: { l: 0, r: 0, t: 0, b: 0 }
	});

	var realLine = line;
	hull.realLine = realLine;

	var isPreviousFloor = realLine.previous && realLine.previous.isFloor;
	var isNextFloor = realLine.next && realLine.next.isFloor;

	line = hull.line.assignl(realLine);
	line.previous = hull.line1;
	line.next = hull.line2;
	line.isFloor = realLine.isFloor;

	var line1 = hull.line1;
	line1.p1.assignxy(0, 0);
	line1.p2.assignxy(0, 0);
	line1.previous = null;
	line1.next = hull.line;
	line1.isFloor = realLine.isFloor;

	var line2 = hull.line2;
	line2.p1.assignxy(0, 0);
	line2.p2.assignxy(0, 0);
	line2.previous = hull.line;
	line2.next = null;
	line2.isFloor = realLine.isFloor;

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
		else if (realLine.previous) {
			line.previous = realLine.previous;
		}
		else {
			line.previous = null;
		}

		if (!realLine.next || !realLine.next.isFloor) {
			line2.p1.assignxy(line.p2.x, line.p2.y);
			line2.p2.assignxy(line.p2.x + offset.l, line.p2.y);
			line2.calculateNormal();
		}
		else if (realLine.next) {
			line.next = realLine.next;
		}
		else {
			line.next = null;
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
			line1.isFloor = false;
			line2.isFloor = false;
		}
		else if (line.normal.x === 1) {
			line.p1.addxy(offset.r, offset.t);
			line.p2.addxy(offset.r, offset.b);
			line1.p1.assignxy(line.p1.x - rc.width, line.p1.y);
			line1.p2.assignxy(line.p1.x, line.p1.y);

			if (!isNextFloor) {
				line2.p1.assignxy(line.p2.x, line.p2.y);
				line2.p2.assignxy(line.p2.x - rc.width, line.p2.y);
				line2.isFloor = true;
			}
		}
		else if (line.normal.x === -1) {
			line.p1.addxy(offset.l, offset.b);
			line.p2.addxy(offset.l, offset.t);

			if (!isPreviousFloor) {
				line1.p1.assignxy(line.p1.x + rc.width, line.p1.y);
				line1.p2.assignxy(line.p1.x, line.p1.y);
				line1.isFloor = true;
			}

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
				if (!isPreviousFloor) {
					line1.p1.assignxy(line.p1.x + rc.width, line.p1.y);
					line1.p2.assignxy(line.p1.x, line.p1.y);
					line1.isFloor = true;
				}

				line2.p1.assignxy(line.p2.x, line.p2.y);
				line2.p2.assignxy(line.p2.x, line.p2.y + rc.height);
			}
			else if (line.normal.x < 0 && line.normal.y > 0) {
				line1.p1.assignxy(line.p1.x, line.p1.y - rc.height);
				line1.p2.assignxy(line.p1.x, line.p1.y);
				line2.p1.assignxy(line.p2.x, line.p2.y);
				line2.p2.assignxy(line.p2.x + rc.width, line.p2.y);
			}
			else {
				line1.p1.assignxy(line.p1.x, line.p1.y + rc.height);
				line1.p2.assignxy(line.p1.x, line.p1.y);

				if (!isNextFloor) {
					line2.p1.assignxy(line.p2.x, line.p2.y);
					line2.p2.assignxy(line.p2.x - rc.width, line.p2.y);
					line2.isFloor = true;
				}
			}
		}

		line1.calculateNormal();
		line2.calculateNormal();
	}

	if (line.previous.hasLength())
		assert(line.previous.p2.equalsv(line.p1), "createLineHull: line.previous.p2 != line.p1");

	if (line.next.hasLength())
		assert(line.next.p1.equalsv(line.p2), "createLineHull: line.previous.p1 != line.p2");

	return hull;
};

Physics.World.prototype.draw = function(context, object) {
	var locals = this.locals_.draw || (this.locals_.draw = {
		bounds: new Rectangle(),
		midpoint: new Vector2(),
		hull: new Physics.LineHull()
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
				context.moveTo(current.p1.x, current.p1.y);
				context.lineTo(current.p2.x, current.p2.y);
				context.stroke();
				context.shadowBlur = 0;
			}

			// normal
			current.midpoint(locals.midpoint);

			context.beginPath();
			context.moveTo(locals.midpoint.x, locals.midpoint.y);
			context.lineTo(locals.midpoint.x + current.normal.x * 10, locals.midpoint.y + current.normal.y * 10);
			context.stroke();

			// line
			context.beginPath();
			context.moveTo(current.p1.x, current.p1.y);
			context.lineTo(current.p2.x, current.p2.y);
			context.stroke();

			// hull
			if (object && this.showCollisionHull_ && current.active) {
				var hull = this.createLineHull(object, current, locals.hull);

				context.lineWidth = 1;
				context.strokeStyle = "rgba(0,0,255,0.4)";

				context.beginPath();
				context.moveTo(hull.line.p1.x, hull.line.p1.y);
				context.lineTo(hull.line.p2.x, hull.line.p2.y);
				context.stroke();

				if (hull.line1.hasLength()) {
					context.beginPath();
					context.moveTo(hull.line1.p1.x, hull.line1.p1.y);
					context.lineTo(hull.line1.p2.x, hull.line1.p2.y);
					context.stroke();
				}

				if (hull.line2.hasLength()) {
					context.beginPath();
					context.moveTo(hull.line2.p1.x, hull.line2.p1.y);
					context.lineTo(hull.line2.p2.x, hull.line2.p2.y);
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
					context.moveTo(bounds.left + bounds.width, bounds.top);
					context.lineTo(bounds.left + bounds.width, bounds.top + bounds.height);
				}
				else {
					context.moveTo(bounds.left, bounds.top + bounds.height);
					context.lineTo(bounds.left + bounds.width, bounds.top + bounds.height);
				}
	
				context.stroke();
			}
		}

		// draw bounding rect
		context.beginPath();
		context.moveTo(locals.bounds.left, locals.bounds.top);
		context.lineTo(locals.bounds.left, locals.bounds.top + locals.bounds.height);
		context.lineTo(locals.bounds.left + locals.bounds.width, locals.bounds.top + locals.bounds.height);
		context.lineTo(locals.bounds.left + locals.bounds.width, locals.bounds.top);
		context.closePath();
		context.stroke();
	}

	context.restore();
};

Physics.World.prototype.drawQuadTreeNode = function(context, node) {
	if (node.subdivided_) {
		context.beginPath();
		context.moveTo(node.bounds_.left + node.bounds_.width / 2, node.bounds_.top);
		context.lineTo(node.bounds_.left + node.bounds_.width / 2, node.bounds_.top + node.bounds_.height);
		context.stroke();

		context.beginPath();
		context.moveTo(node.bounds_.left , node.bounds_.top + node.bounds_.height / 2);
		context.lineTo(node.bounds_.left + node.bounds_.width, node.bounds_.top + node.bounds_.height / 2);
		context.stroke();

		this.drawQuadTreeNode(context, node.nodes_.topLeft);
		this.drawQuadTreeNode(context, node.nodes_.topRight);
		this.drawQuadTreeNode(context, node.nodes_.bottomLeft);
		this.drawQuadTreeNode(context, node.nodes_.bottomRight);
	}
};

Physics.World.prototype.resetActiveLines = function() {
	for (var i = this.activeLines_.length - 1; i >= 0; i--) {
		this.activeLines_[i].active = false;
	}

	this.activeLines_.length = 0;
};


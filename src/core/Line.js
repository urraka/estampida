function Line(p1, p2) {
	this.p1 = new Vector2();
	this.p2 = new Vector2();
	this.normal = new Vector2();

	if (p1) this.assign(p1, p2);
}

Line.prototype.assign = function(p1, p2) {
	if (p1 instanceof Line)
		return this.assignl(p1);
	else
		return this.assignp(p1, p2);
}

Line.prototype.assignl = function(line) {
	this.p1.assignv(line.p1);
	this.p2.assignv(line.p2);
	this.calculateNormal();
	return this;
}

Line.prototype.assignp = function(p1, p2) {
	this.p1.assignv(p1);
	this.p2.assignv(p2);
	this.calculateNormal();
	return this;
}

Line.prototype.calculateNormal = function() {
	return this.normal.assignxy(-(this.p2.y - this.p1.y), this.p2.x - this.p1.x).normalize();
}

Line.prototype.hasLength = function() {
	return this.p1.x !== this.p2.x || this.p1.y !== this.p2.y;
}

Line.prototype.midpoint = function(result) {
	if (!result) result = new Vector2();
	result.x = (this.p1.x + this.p2.x) / 2;
	result.y = (this.p1.y + this.p2.y) / 2;
	return result;
}

Line.prototype.slope = function() {
	if (this.p1.x === this.p2.x)
		return Infinity;

	if (Math.abs(this.p1.y - this.p2.y) < kEpsilon)
		return 0;

	return (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x);
}

Line.prototype.intersection = function(line, result) {
	var x1 = this.p1.x;
	var x2 = this.p2.x;
	var x3 = line.p1.x;
	var x4 = line.p2.x;
	
	var y1 = this.p1.y;
	var y2 = this.p2.y;
	var y3 = line.p1.y;
	var y4 = line.p2.y;
	
	var uaNum = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
	var ubNum = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
	var uaDem = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	
	if (uaDem == 0)
		return null;
	
	var ua = uaNum / uaDem;
	var ub = ubNum / uaDem;
	
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1)
		return null;
	
	var x = x1 + ua * (x2 - x1);
	var y = y1 + ua * (y2 - y1);

	if (!result) result = new Vector2();

	return result.assignxy(x, y);
}

Line.prototype.getBounds = function(result) {
	if (!result) result = new Rectangle();
	result.left   = Math.min(this.p1.x, this.p2.x);
	result.top    = Math.min(this.p1.y, this.p2.y);
	result.width  = Math.abs(this.p2.x - this.p1.x);
	result.height = Math.abs(this.p2.y - this.p1.y);
	return result;
}

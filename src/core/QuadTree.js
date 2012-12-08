// QuadTree

QuadTree = function(bounds, itemBelongsToRectFunc, maxDepth, maxChildren) {
	this.itemBelongsToRect_ = itemBelongsToRectFunc;
	this.root_ = new QuadTreeNode(bounds, itemBelongsToRectFunc, 0, maxDepth, maxChildren);
}

QuadTree.prototype.insert = function(item) {
	this.root_.insert(item);
}

QuadTree.prototype.clear = function() {
	this.root_.clear();
}

QuadTree.prototype.retrieve = function(bounds, result) {
	if (!result) result = [];
	this.root_.retrieve(bounds, result);
	return result;
}

// QuadTreeNode

function QuadTreeNode(bounds, itemBelongsToRectFunc, depth, maxDepth, maxChildren) {
	this.bounds_ = new Rectangle(bounds);
	this.itemBelongsToRect_ = itemBelongsToRectFunc;
	this.nodes_ = { topLeft: null, topRight: null, bottomLeft: null, bottomRight: null };
	this.subdivided_ = false;
	this.children_ = [];
	this.depth_ = depth || 0;
	this.maxDepth_ = maxDepth || 4;
	this.maxChildren_ = maxChildren || 4;
}

QuadTreeNode.prototype.locals_ = {};

QuadTreeNode.prototype.insert = function(item) {
	if (!this.itemBelongsToRect_(item, this.bounds_))
		return;

	if (!this.subdivided_ && this.depth_ < this.maxDepth_ && this.children_.length == this.maxChildren_)
		this.subdivide();

	if (this.subdivided_) {
		this.nodes_.topLeft.insert(item);
		this.nodes_.topRight.insert(item);
		this.nodes_.bottomLeft.insert(item);
		this.nodes_.bottomRight.insert(item);
	}
	else {
		this.children_.push(item);
	}
}

QuadTreeNode.prototype.subdivide = function() {
	var locals = this.locals_.subdivide || (this.locals_.subdivide = {
		rc: new Rectangle()
	});

	if (this.subdivided_)
		return;

	var depth = this.depth_ + 1;
	var rc = locals.rc;
	var x = this.bounds_.left;
	var y = this.bounds_.top;
	var w = Math.round(this.bounds_.width / 2);
	var h = Math.round(this.bounds_.height / 2);
	var W = this.bounds_.width;
	var H = this.bounds_.height;

	this.nodes_.topLeft     = new QuadTreeNode(rc.assign(x, y, w, h), this.itemBelongsToRect_, depth, this.maxDepth_, this.maxChildren_);
	this.nodes_.bottomLeft  = new QuadTreeNode(rc.assign(x, y + h, w, H - h), this.itemBelongsToRect_, depth, this.maxDepth_, this.maxChildren_);
	this.nodes_.topRight    = new QuadTreeNode(rc.assign(x + w, y, W - w, h), this.itemBelongsToRect_, depth, this.maxDepth_, this.maxChildren_);
	this.nodes_.bottomRight = new QuadTreeNode(rc.assign(x + w, y + h, W - w, H - h), this.itemBelongsToRect_, depth, this.maxDepth_, this.maxChildren_);

	for (var i = this.children_.length - 1; i >= 0; i--) {
		this.nodes_.topLeft.insert(this.children_[i]);
		this.nodes_.bottomLeft.insert(this.children_[i]);
		this.nodes_.topRight.insert(this.children_[i]);
		this.nodes_.bottomRight.insert(this.children_[i]);
	}

	this.subdivided_ = true;
	this.children_.length = 0;
}

QuadTreeNode.prototype.retrieve = function(bounds, result) {
	if (!this.bounds_.intersects(bounds))
		return;

	if (this.subdivided_) {
		this.nodes_.topLeft.retrieve(bounds, result);
		this.nodes_.bottomLeft.retrieve(bounds, result);
		this.nodes_.topRight.retrieve(bounds, result);
		this.nodes_.bottomRight.retrieve(bounds, result);
	}
	else {
		var len = result.length;
		for (var i = this.children_.length - 1; i >= 0; i--) {
			var item = this.children_[i];
			if (result.lastIndexOf(item, len - 1) === -1) {
				result.push(item);
			}
		}
	}
}

QuadTreeNode.prototype.clear = function() {
	if (this.subdivided_) {
		this.subdivided_ = false;
		this.nodes_.topLeft.clear();
		this.nodes_.topRight.clear();
		this.nodes_.bottomLeft.clear();
		this.nodes_.bottomRight.clear();		
		this.nodes_.topLeft = null;
		this.nodes_.topRight = null;
		this.nodes_.bottomLeft = null;
		this.nodes_.bottomRight = null;
	}

	this.children_.length = 0;
}

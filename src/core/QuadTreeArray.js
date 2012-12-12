/*
 * This object holds an array of contiguous and square QuadTrees, either vertically or
 * horizontally, to fill the rectangle delimited by `bounds`.
 */
function QuadTreeArray(bounds, itemCallbacks, maxDepth, maxChildren) {
	this.quadTrees_ = [];
	this.bounds_ = new Rectangle(bounds);
	this.itemCallbacks_ = itemCallbacks;

	var horizontal, size;

	if (bounds.width > bounds.height) {
		this.quadTrees_.length = Math.ceil(bounds.width / bounds.height);
		size = bounds.height;
		horizontal = true;
	}
	else {
		this.quadTrees_.length = Math.ceil(bounds.height / bounds.width);
		size = bounds.width;
		horizontal = false;
	}

	bounds.width = size;
	bounds.height = size;

	var len = this.quadTrees_.length;

	for (var i = 0; i < len; i++) {
		this.quadTrees_[i] = new QuadTree(bounds, itemCallbacks.intersectsRect, maxDepth, maxChildren);

		if (horizontal)
			bounds.left += size;
		else
			bounds.top += size;
	}
}

QuadTreeArray.prototype.locals_ = {};

QuadTreeArray.prototype.insert = function(item) {
	var locals = this.locals_.insert || (this.locals_.insert = {
		bounds: new Rectangle()
	});

	var bounds = this.itemCallbacks_.getBounds(item, locals.bounds);
	var min = this.getTreeIndexMin_(bounds);
	var max = this.getTreeIndexMax_(bounds);

	for (var i = min; i <= max; i++)
		this.quadTrees_[i].insert(item);
}

QuadTreeArray.prototype.retrieve = function(bounds, result) {
	result = result || [];

	var min = this.getTreeIndexMin_(bounds);
	var max = this.getTreeIndexMax_(bounds);

	for (var i = min; i <= max; i++)
		this.quadTrees_[i].retrieve(bounds, result);

	return result;
}

QuadTreeArray.prototype.getTreeIndexMin_ = function(bounds) {
	if (this.bounds_.width > this.bounds_.height)
		return Math.max(0, Math.floor((bounds.left - this.bounds_.left) / this.bounds_.height));
	else
		return Math.max(0, Math.floor((bounds.top - this.bounds_.top) / this.bounds_.width));
}

QuadTreeArray.prototype.getTreeIndexMax_ = function(bounds) {
	if (this.bounds_.width > this.bounds_.height)
		return Math.min(this.quadTrees_.length - 1, Math.floor((bounds.left + bounds.width - this.bounds_.left) / this.bounds_.height));
	else
		return Math.min(this.quadTrees_.length - 1, Math.floor((bounds.top + bounds.height - this.bounds_.top) / this.bounds_.width));
}

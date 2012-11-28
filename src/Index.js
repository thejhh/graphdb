
/* Simple block-based file storage for Copy on Write implementations */

/** Constructor */
function Index(opts) {
	var self = this;
	opts = opts || {};
	self.id = parseInt(opts.id, 10);
	self.offset = parseInt(opts.offset, 10);
	self.length = parseInt(opts.length, 10);
}

/** Returns string presentation of the index */
Index.prototype.toString = function() {
	var self = this;
	return '#' + self.id + '@' + self.offset + '+' + self.length;
};

// 
module.exports = Index;

/* EOF */

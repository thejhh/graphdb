
/* Simple block-based file storage for Copy on Write implementations */

/** Constructor */
function Index(opts) {
	var self = this;
	opts = opts || {};
	self.id = parseInt(opts.id, 10);			// Position in the index file
	self.offset = parseInt(opts.offset, 10);	// Offset in the data file
	self.length = parseInt(opts.length, 10);	// Length of the data block
}

/** Returns string presentation of the index */
Index.prototype.toString = function() {
	var self = this;
	return '#' + self.id + '@' + self.offset +'-' + (self.offset + self.length-1) + '(' + self.length+')';
};

/** Returns the index in binary format as a Buffer
 * FIXME: Maximum size for data files with this implementation is 4 GB! (However implemented format supports 64-bit offsets.)
 */
/*
Index.prototype.toBuffer = function() {
	var self = this;
	var buf = new Buffer(8);
	buf.fill(0, 0, 4); // Preserve extra 4 bytes for offsets beyond 4 GB limit
	buf.writeUInt32BE(self.offset, 4);
	return buf;
};
*/

// 
module.exports = Index;

/* EOF */

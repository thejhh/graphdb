
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var Index = require('./Index.js');

/** Constructor */
function Indexes(opts) {
	var self = this;
	opts = opts || {};
	self._file = opts.file;
	self._indexes = {};
}

/** Get index from location x */
Indexes.prototype.get = function(x) {
	var self = this;
	return self._indexes[x];
};

/** Save index to location x */
Indexes.prototype.set = function(x, i) {
	var self = this;
	if(!(i instanceof 'Index')) throw new TypeError("Argument for Indexes.prototype.set is not a Index!");
	self._indexes[x] = i;
	return self;
};

/** Save indexes to file */
Indexes.prototype.save = function(file) {
};

/** Read indexes from index file */
Indexes.open = function(file) {
};

/** Build indexes from data file */
Indexes.rebuild = function(file) {
	var defer = q.defer();
	return defer.promise;
};

// 
module.exports = Index;

/* EOF */

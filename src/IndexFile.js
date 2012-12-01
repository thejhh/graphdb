
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var Index = require('./Index.js');

/** Constructor */
function Indexes(opts) {
	var self = this;
	opts = opts || {};
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
Indexes.rebuild = function(path) {
	var file;
	var Indexes = new Indexes(path);
	return File.open(path, 'r').then(function(f) {
		file = f;
		var data_offset = 0;
		var s = new File.TextReadStream(f, {buffer_size:1024});
		s.on('data', errors.catchfail(function(data) {
			var rows = data.split("\n");
			rows.map(function(row) {
				console.error("DEBUG: row = '" + row + "' at " + data_offset + "-" + (row.length + 1));
				data_offset += row.length + 1;
			});
		}));
		s.on('end', errors.catchfail(function() {
		}));
		return s.read();
	}).fin(function() {
		if(file) file.close();
	}).fail(function(err) {
		errors.print(err);
	});
};

// 
module.exports = Indexes;

/* EOF */

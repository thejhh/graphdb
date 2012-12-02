
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var Index = require('./Index.js');

function resolve_data_path(p) {
	return path.resolve(path.dirname(p), path.basename(p, path.extname(p)) + ".json");
}

function resolve_index_path(p) {
	return path.resolve(path.dirname(p), path.basename(p, path.extname(p)) + ".index");
}
	
/** Constructor */
function Indices(opts) {
	var self = this;
	opts = opts || {};
	self._indices = {};
}

/** Get index from location x */
Indices.prototype.get = function(x) {
	var self = this;
	return self._indices[x];
};

/** Save index to location x */
Indices.prototype.set = function(x, i) {
	var self = this;
	if(!(i instanceof 'Index')) throw new TypeError("Argument for Indices.prototype.set is not a Index!");
	self._indices[x] = i;
	return self;
};

/** Save indices to file */
Indices.prototype.save = function(file) {
};

/** Read indices from index file */
Indices.open = function(file) {
};

/** Build indices from data file */
Indices.rebuild = function(data_path) {
	data_path = resolve_data_path(data_path);
	var data_file;
	var indices = new Indices(resolve_index_path(data_path));
	return File.open(data_path, 'r').then(function(f) {
		data_file = f;
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
		if(data_file) data_file.close();
	}).fail(function(err) {
		errors.print(err);
	});
};

// 
module.exports = Indices;

/* EOF */

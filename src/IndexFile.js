
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var path = require('path');
var errors = require('./errors.js');
var File = require('./File.js');
var Index = require('./Index.js');

function resolve_data_path(p) {
	var e = path.extname(p);
	if(e === ".index") return path.resolve(path.dirname(p), path.basename(p, e) + ".json");
	return path.resolve(path.dirname(p), path.basename(p));
}

function resolve_index_path(p) {
	return path.resolve(path.dirname(p), path.basename(p, path.extname(p)) + ".index");
}

/** Constructor */
function IndexFile(file, opts) {
	var self = this;
	if(!opts) {
		opts = file;
		file = undefined;
	}
	opts = opts || {};
	self._file = opts.file;
	self._indices = {};
}

/** Get string presentation */
IndexFile.prototype.toString = function() {
	var self = this;
	return "IndexFile(" + self._file + ")";
};

/** Get index from location x. This function will make use of a local cache. */
IndexFile.prototype.get = function(x) {
	var self = this;
	return self._indices[x];
};

/** Save index to location x. This function will make use of a local cache. */
IndexFile.prototype.set = function(x, i) {
	var self = this;
	if(!(i instanceof 'Index')) throw new TypeError("Argument for IndexFile.prototype.set is not a Index!");
	self._indices[x] = i;
	return self;
};

/** Save index to file. Doesn't use cache. */
IndexFile.prototype.save = function(index) {
};

/** Read index from file */
IndexFile.prototype.read = function(x) {
};

/** Build indices from data file */
IndexFile.rebuild = function(data_path) {
	data_path = resolve_data_path(data_path);
	var data_file;
	var index_file = new IndexFile(resolve_index_path(data_path));
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
	}).then(function() {
		return index_file;
	});
};

// 
module.exports = IndexFile;

/* EOF */

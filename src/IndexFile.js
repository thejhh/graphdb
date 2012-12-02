
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var path = require('path');
var errors = require('./errors.js');
var File = require('./File.js');
var Index = require('./Index.js');
var buffer_utils = require('./buffer_utils.js');

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
	opts = opts || {};
	self._file = file;
	self._indices = {};
	if(!self._file) throw new TypeError("No filename set!");
	self._fd = File.exists(self._file).then(function(exists) {
		if(exists) return File.open(self._file, 'r+');
		return File.open(self._file, 'w+');
	});
	self.index_size = 8;
}

/* Close file */
IndexFile.prototype.close = function() {
	var self = this;
	return self._fd.then(function(f) { return f.close(); });
};

/** Get string presentation */
IndexFile.prototype.toString = function() {
	var self = this;
	return "IndexFile(" + self._file + ")";
};

/** Get index or indices from location(s). Use array of positions to fetch more than one index. */
IndexFile.prototype.get = function(x) {
	var self = this;
	if(!(x instanceof Array)) {
		return self._get(x);
	}
	var promises = x.map(function(i) {
		return self._get(i);
	});
	return Q.all(promises);
};

/** Save index or array of indices */
IndexFile.prototype.save = function(index) {
	var self = this;
	if(!(index instanceof Array)) {
		return self._save(index);
	}
	var promises = index.map(function(i) {
		return self._save(i);
	});
	return Q.all(promises);
};

/** Read index from file */
IndexFile.prototype._get = function(x) {
	var self = this;
	var buf = new Buffer(self.index_size);
	return this._fd.then(function(f) {
		return f.read(buf, 0, self.index_size, x*self.index_size);
	}).then(function(data) {
		if(data.bytesRead < self.index_size) {
			return new TypeError("We didn't get enough data!");
		}
		return data.buffer.readUInt32BE(4);
	});
};

/** Save index directly to a file. Doesn't use cache. */
IndexFile.prototype._save = function(index) {
	if(!(index instanceof Index)) return new TypeError("Argument is not an Index!");
	var self = this;
	var buf = new Buffer(self.index_size);
	buf.writeUInt32BE(index.offset, 4);
	return this._fd.then(function(f) {
		return f.write(buf, 0, self.index_size, index.id*self.index_size);
	}).then(function(data) {
		if(data.written < self.index_size) {
			return new TypeError("We couldn't write all data! MAYBE BROKEN INDEX!");
		}
	});
};

/** Build indices from data file */
IndexFile.rebuild = function(data_path) {
	data_path = resolve_data_path(data_path);
	var data_file;
	var index_file = new IndexFile(resolve_index_path(data_path));
	return File.open(data_path, 'r').then(function(f) {
		data_file = f;
		var data_id = 0;
		var data_offset = 0;
		var s = new File.VariableReadStream(f, {buffer_size:1024, delimiter:'\n'.charCodeAt(0)});
		s.on('data', errors.catchfail(function(data, len) {
			var rows = buffer_utils.split("\n".charCodeAt(0), data, len);
			var indices = rows.map(function(row) {
				console.error("DEBUG: row = '" + row + "' at " + data_offset + "+" + (row.length + 1));
				var index = new Index({'id':data_id, 'offset':data_offset, 'length':row.length + 1});
				console.error("DEBUG: index = " + index);
				data_offset += row.length + 1;
				data_id++;
				return index_file.save(index);
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

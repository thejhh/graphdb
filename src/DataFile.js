
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var path = require('path');
var errors = require('./errors.js');
var File = require('./File.js');
var Index = require('./Index.js');
var buffer_utils = require('./buffer_utils.js');

/** Constructor */
function DataFile(file, opts) {
	var self = this;
	opts = opts || {};
	self._data_file = path_utils.resolve_data_path(file);
	if(!self._data_file) throw new TypeError("No filename set!");
	self._fd = File.exists(self._data_file).then(function(exists) {
		if(exists) return File.open(self._data_file, 'r+');
		return new Error("File does not exist: " + self._data_file);
	});
	do_restat(self);
}

/* */
DataFile.prototype.restat = function() {
	return do_restat(this);
};

/* Close file */
DataFile.prototype.close = function() {
	var self = this;
	return self._fd.then(function(f) { return f.close(); });
};

/** Get string presentation */
DataFile.prototype.toString = function() {
	var self = this;
	return "DataFile(" + self._data_file + ")";
};

/** Get data from location(s). Use array of positions to fetch more than one index. */
DataFile.prototype.get = function(x) {
	/*
	var self = this;
	if(!(x instanceof Array)) {
		return self._stat.then(function(stats) {
			var start_p = self._get(x);
			//console.error("DEBUG: stats.data.size = " + stats.data.size);
			//console.error("DEBUG: stats.count_of_indices = " + stats.count_of_indices);
			//console.error("DEBUG: x = " + x);
			var end_p = (x+1 < stats.count_of_indices) ? self._get(x+1) : q.resolve(stats.data.size);
			return q.spread([start_p, end_p], function (offset, next_offset) {
				//console.error("DEBUG: offset="+ offset + ", next_offset="+ next_offset);
				return new Index({'id': x, 'offset': offset, 'length': (next_offset-offset-1) });
			});
		});
	}
	var promises = x.map(function(i) {
		return self.get(i);
	});
	return q.all(promises);
	*/
};

/** Save data to location x or locations if array*/
DataFile.prototype.save = function(x, data) {
	/*
	var self = this;
	if(!(index instanceof Array)) {
		return q.all(self._save(index), self.restat());
	}
	var promises = index.map(function(i) {
		return self._save(i);
	});
	promises.push(self.restat());
	return q.all(promises);
	*/
};

/** Read data from file by index x */
DataFile.prototype._get = function(x) {
	x = parseInt(x, 10);
/*
	var self = this;
	var buf = new Buffer(self.index_size);
	var p = this._fd.then(function(f) {
		return f.read(buf, 0, self.index_size, x*self.index_size);
	}).then(function(data) {
		if(data.bytesRead < self.index_size) {
			return new TypeError("We didn't get enough data!");
		}
		return data.buffer.readUInt32BE(4);
	});
	return p;
*/
};

/** Save index directly to a file. Doesn't use cache. */
DataFile.prototype._save = function(index) {
	/*
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
	*/
};

/** Build indices from data file */
DataFile.rebuild = function(data_path) {
	data_path = path_utils.resolve_data_path(data_path);
	var data_file;
	var index_file = new DataFile(path_utils.resolve_index_path(data_path));
	return File.open(data_path, 'r').then(function(f) {
		data_file = f;
		var data_id = 0;
		var data_offset = 0;
		var s = new File.VariableReadStream(f, {buffer_size:1024, delimiter:'\n'.charCodeAt(0)});
		s.on('data', errors.catchfail(function(data, len) {
			if(data[len-1] === "\n".charCodeAt(0)) len = len-1;
			var rows = buffer_utils.split("\n".charCodeAt(0), data, len);
			var indices = rows.map(function(row) {
				//console.error("DEBUG: row = '" + row + "' at " + data_offset + "+" + (row.length + 1));
				var index = new Index({'id':data_id, 'offset':data_offset, 'length':row.length});
				//console.error("DEBUG: index = " + index);
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
module.exports = DataFile;

/* EOF */

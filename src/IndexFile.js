
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
Indexes.rebuild = function(path) {
	var defer = q.defer();
	fs.open(path, 'r', 0666, function(err, fd) {
		if(err) {
			defer.reject(err);
			return;
		}

		var buffer = new Buffer(1024);
		fs.read(fd, buffer, 0, buffer.length, null, function(err, bytesRead, buffer) {
			if(err) {
				defer.reject(err);
				return;
			}
			
			var i = bytesRead-1;
			for(; i>=0; i=i-1) {
				if(buffer[i] === "\n".charCodeAt(0)) {
					defer.resolve( buffer.toString('utf8', 0, i).join('\n') );
				}
			}
		});
	});
	return defer.promise;
};

// 
module.exports = Index;

/* EOF */

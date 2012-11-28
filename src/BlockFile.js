
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var fs = require('fs');
var mod = module.exports = {};

/** Constructor */
function BlockFile(opts) {
	var self = this;
	opts = opts || {};
	if(!opts.fd) throw new TypeError("No fd specified!");
	self._fd = opts.fd;
	self._path = opts.path;
};

/** Read a record from offset X
 */
BlockFile.prototype.read = function(index) {
	var defer = q.defer();
	var self = this;
	var buffer = new Buffer(index.length());
	fs.read(self._fd, buffer, 0, buffer.length, index.offset(), function(err, bytesRead, b) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve( b.toString('utf8', 0, bytesRead) );
		}
	});
	return defer.promise;
};

/** Append new record */
BlockFile.prototype.append = function(record) {
};

/** Open a file */
mod.open = function(path) {
	var defer = q.defer();
	fs.open(path, flags, 0666, errors.catchfail(function(err, fd) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve( new BlockFile({fd:fd, path:path}) );
		}
	}));
	return defer.promise;
};

/* EOF */

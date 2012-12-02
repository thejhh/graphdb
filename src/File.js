
/* Interface implementing q'ied fs module */

var fs = require('fs');
var util = require('util');
var errors = require('./errors.js');
var q = require('q');
var EventEmitter = require('events').EventEmitter;
var ReadStream = require('./ReadStream.js');
var TextReadStream = require('./TextReadStream.js');
var VariableReadStream = require('./VariableReadStream.js');

/* TODO: Implement buffered File implementation */

/* */
var mod = module.exports = {};

/** */
function Descriptor(fd) {
	var self = this;
	EventEmitter.call(self);
	self.fd = fd;
}
util.inherits(Descriptor, EventEmitter);

mod.Descriptor = Descriptor;

/** Truncate a file to a specified length. Asynchronous ftruncate(2). */
Descriptor.prototype.truncate = function(len) {
	var self = this;
	var defer = q.defer();
	fs.truncate(self.fd, len, errors.catchfail(function(err) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve();
		}
	}));
	return defer.promise;
};

/** Change ownership of a file. Asynchronous fchown(2). */
Descriptor.prototype.fchown = function(uid, gid) {
	var self = this;
	var defer = q.defer();
	fs.fchown(self.fd, uid, gid, errors.catchfail(function(err) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve();
		}
	}));
	return defer.promise;
};

/** Change permissions of a file. Asynchronous fchmod(2). */
Descriptor.prototype.fchmod = function(mode) {
	var self = this;
	var defer = q.defer();
	fs.fchmod(self.fd, mode, errors.catchfail(function(err) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve();
		}
	}));
	return defer.promise;
};

/** Get file status. Asynchronous fstat(2). */
Descriptor.prototype.fstat = function() {
	var self = this;
	var defer = q.defer();
	fs.fstat(self.fd, errors.catchfail(function(err, stats) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(stats);
		}
	}));
	return defer.promise;
};

/** Close a file descriptor. Asynchronous close(2). */
Descriptor.prototype.close = function() {
	var self = this;
	var defer = q.defer();
	fs.close(self.fd, errors.catchfail(function(err) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve();
		}
	}));
	return defer.promise;
};

/** Change the file timestamps of a file referenced by the supplied file descriptor. */
Descriptor.prototype.futimes = function(atime, mtime) {
	var self = this;
	var defer = q.defer();
	fs.futimes(self.fd, atime, mtime, errors.catchfail(function(err) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve();
		}
	}));
	return defer.promise;
};

/** Synchronize a file's in-core state with storage device. Asynchronous fsync(2). */
Descriptor.prototype.fsync = function() {
	var self = this;
	var defer = q.defer();
	fs.fsync(self.fd, errors.catchfail(function(err) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve();
		}
	}));
	return defer.promise;
};

/** Write to file */
Descriptor.prototype.write = function(buffer, offset, length, position) {
	var self = this;
	var defer = q.defer();
	fs.write(self.fd, buffer, offset, length, position, errors.catchfail(function(err, written, buffer) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(written, buffer);
		}
	}));
	return defer.promise;
};

/** Read from file */
Descriptor.prototype.read = function(buffer, offset, length, position) {
	var self = this;
	var defer = q.defer();
	fs.read(self.fd, buffer, offset, length, position, errors.catchfail(function(err, bytesRead, b) {
		if(err) {
			defer.reject(err);
		} else {
			var s = buffer.slice(offset, offset+bytesRead);
			if(s === undefined) throw TypeError("s is undefined");
			//console.error("File.js: DEBUG: bytesRead = " + bytesRead);
			//console.error("File.js: DEBUG: s = " + s);
			defer.resolve({bytesRead:bytesRead, buffer:s});
		}
	}));
	return defer.promise;
};

/** Open file */
mod.open = function(path, flags, mode) {
	var defer = q.defer();
	fs.open(path, flags, mode, errors.catchfail(function(err, fd) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(new Descriptor(fd));
		}
	}));
	return defer.promise;
};

/** */
mod.exists = function(path) {
	var defer = q.defer();
	fs.exists(path, errors.catchfail(function(exists) {
		defer.resolve(exists);
	}));
	return defer.promise;
};

/** Open stream for reading */
mod.ReadStream = ReadStream;
mod.TextReadStream = TextReadStream;
mod.VariableReadStream = VariableReadStream;

/* EOF */

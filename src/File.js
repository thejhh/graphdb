
/* Interface implementing q'ied fs module */

var fs = require('fs');
var util = require('util');
var errors = require('./errors.js');
var q = require('q');
var EventEmitter = require('events').EventEmitter;

/* */
var mod = module.exports = {};

/** */
function FileDescriptor(fd) {
	var self = this;
	EventEmitter.call(self);
	self.fd = fd;
}
util.inherits(FileDescriptor, EventEmitter);

mod.FileDescriptor = FileDescriptor;

/** Open file */
mod.open = function(path, flags, mode) {
	var defer = q.defer();
	fs.open(path, flags, mode, errors.catchfail(function(err, fd) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(new FileDescriptor(fd));
		}
	}));
	return defer.promise;
};

/** Truncate a file to a specified length. Asynchronous ftruncate(2). */
FileDescriptor.prototype.truncate = function(len) {
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
FileDescriptor.prototype.fchown = function(uid, gid) {
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
FileDescriptor.prototype.fchmod = function(mode) {
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
FileDescriptor.prototype.fstat = function() {
	var self = this;
	var defer = q.defer();
	fs.fstat(self.fd, errors.catchfail(function(err, stats) {
		// FIXME: TODO: Should we wrap stats to something else?
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(stats);
		}
	}));
	return defer.promise;
};

/** Close a file descriptor. Asynchronous close(2). */
FileDescriptor.prototype.close = function() {
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
FileDescriptor.prototype.futimes = function(atime, mtime) {
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
FileDescriptor.prototype.fsync = function() {
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
FileDescriptor.prototype.write = function(buffer, offset, length, position) {
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
FileDescriptor.prototype.read = function(buffer, offset, length, position) {
	var self = this;
	var defer = q.defer();
	fs.read(self.fd, buffer, offset, length, position, errors.catchfail(function(err, bytesRead, buffer) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(bytesRead, buffer);
		}
	}));
	return defer.promise;
};

/* EOF */

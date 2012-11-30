
/* Simple block-based file storage for Copy on Write implementations */

var fs = require('fs');
var util = require('util');
var errors = require('./errors.js');
var q = require('q');
var EventEmitter = require('events').EventEmitter;

/** */
function Reader(buffer_size) {
	var self = this;
	EventEmitter.call(self);
	buffer_size = buffer_size || 1024;
	self.buffer = new Buffer(buffer_size);
	self.buffer.fill("?"); // FIXME: This isn't neccessary in production?
	self.buffer_left = 0;
}
util.inherits(Reader, EventEmitter);

/** Read next lines from file */
Reader.prototype.readLines = function() {
	//console.error('DEBUG: Reader.readLines called');
	var self = this;
	var defer = q.defer();
	var buffer = self.buffer;
	var buffer_left = self.buffer_left;
	console.error('DEBUG: buffer.length=' + buffer.length + ', buffer_left=' + buffer_left);
	console.error('DEBUG: Calling fs.read(fd=' + self.fd + ', buffer="' + buffer + '", offset=' + buffer_left + ', length=' + (buffer.length-buffer_left) + ')');
	fs.read(self.fd, buffer, buffer_left, buffer.length-buffer_left, null, errors.catchfail(function(err, bytesRead, buffer) {
		console.error('DEBUG: fs.read returns with (' + err + ', '+ bytesRead+', '+buffer + ')');

		if(err) {
			defer.reject(err);
			return;
		}
		
		var i = buffer_left+bytesRead-1, rows;
		for(; i>=0; i=i-1) {
			if(buffer[i] === "\n".charCodeAt(0)) { break; }
		}
		console.error("DEBUG: last end of line here: i=" + i);

		if((bytesRead !== 0) && (i < 0)) {
			if(!self.orig_buffer_size) self.orig_buffer_size = buffer.length;
			console.error("Warning! Resizing buffer from " + buffer.length + " to " + (buffer.length+self.orig_buffer_size) + " bytes.");
			self.buffer = new Buffer(buffer.length+self.orig_buffer_size);
			self.buffer.fill("?"); // FIXME: This isn't neccessary in production?
			buffer.copy(self.buffer, 0, 0, buffer_left+bytesRead);
			self.buffer_left = buffer_left+bytesRead;
			self.readLines().then(function(rows) {
				defer.resolve(rows);
			}, function(err) {
				defer.reject(err);
			});
			return;
		}

		rows = buffer.toString('utf8', 0, i).split('\n');
		console.error("DEBUG: rows = " + JSON.stringify(rows));
		if(i+1 < bytesRead+self.buffer_left) {
			console.error("Copying from " + (i+1) + " to " + (bytesRead+self.buffer_left) + "...");
			console.error("DEBUG: buffer before copy = \"" + buffer + "\"");
			buffer.copy(buffer, 0, i+1, bytesRead+self.buffer_left);
			console.error("DEBUG: buffer after copy = \"" + buffer + "\"");
		}
		console.error("DEBUG: i = " + i);
		console.error("DEBUG: bytesRead = " + bytesRead);
		self.buffer_left = bytesRead-(i-self.buffer_left)-1;
		console.error("DEBUG: buffer_left after reset = " + self.buffer_left);
		defer.resolve( rows );
	}));
	return defer.promise;
};

/** Open file for reading */
Reader.prototype.open = function(path) {
	//console.error('DEBUG: Reader.open called with path=' + path);
	var self = this;
	var defer = q.defer();
	fs.open(path, 'r', 0666, errors.catchfail(function(err, fd) {
		//console.error('DEBUG: Reader.open returned with path=' + path + ", and values err="+err+", fd="+fd);
		if(err) {
			defer.reject(err);
		} else {
			self.fd = fd;
			defer.resolve(self);
		}
	}));
	return defer.promise;
};

/** Start reading until EOL */
Reader.prototype.start = function() {
	var self = this;
	
	function step() {
		self.readLines().then(function(rows) {
			self.emit('data', rows);
			step();
		}, function(err) {
			self.emit('error', err);
		});
	}

	step();
};

/** Read file */
module.exports = Reader;

/* EOF */

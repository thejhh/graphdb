
/* Interface implementing q'ied fs module */

var fs = require('fs');
var util = require('util');
var errors = require('./errors.js');
var q = require('q');
var EventEmitter = require('events').EventEmitter;

/** */
function ReadStream(file, opts) {
	var self = this;
	EventEmitter.call(self);
	self.file = file;
	opts = opts || {};
	self.opts = {};
	self.opts.buffer_size = opts.buffer_size || 128;
}
util.inherits(ReadStream, EventEmitter);

/* Start reading */
ReadStream.prototype.read = function(amount) {
	var self = this;
	var defer = q.defer();
	var continuous = amount ? false : true;
	var buffer_len = amount ? amount : self.opts.buffer_size;
	var buffer = new Buffer(buffer_len);
	function do_next() {
		//console.error('ReadStream.js: DEBUG: @do_next');
		self.file.read(buffer, 0, buffer_len, null).then(function(data) {
			//console.error('ReadStream.js: DEBUG: data.bytesRead = ' + data.bytesRead);
			if(data.buffer === undefined) throw new TypeError("data.buffer is undefined!");
			//console.error('ReadStream.js: DEBUG: data.buffer = ' + data.buffer);
			if(data.bytesRead === 0) {
				self.emit('end');
				defer.resolve();
			} else {
				self.emit('data', data.buffer, data.bytesRead);
				if(continuous) {
					process.nextTick(do_next);
				} else {
					defer.resolve();
				}
			}
		}, function(err) {
			defer.reject(err);
		}).done();
	}
	do_next();
	return defer.promise;
};

// Export as module
module.exports = ReadStream;

/* EOF */

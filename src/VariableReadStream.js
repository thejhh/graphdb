/* Interface implementing VariableReadStream */

var fs = require('fs');
var util = require('util');
var errors = require('./errors.js');
var q = require('q');
var EventEmitter = require('events').EventEmitter;
var ReadStream = require('./ReadStream.js');
var buffer_utils = require('./buffer_utils.js');

/** */
function VariableReadStream(file, opts) {
	var self = this;
	EventEmitter.call(self);
	opts = opts || {};
	self.delimiter = opts.delimiter || 30; // ASCII 30 - Record Separator
	self.internal = new ReadStream(file, opts);
}
util.inherits(VariableReadStream, EventEmitter);

/** Internal builder for listeners */
function init_listeners(self) {
	var tmp;
	var last_buffer_len = 0;
	var last_buffer = new Buffer(self.internal.opts.buffer_size);
	last_buffer.fill('#'); // FIXME: This could be disabled in production code to improve performance
	self.internal.on('data', function(n, bytesRead) {
		//console.error("DEBUG: data event triggered with n = '" + n.slice(0, bytesRead) + "', bytesRead=" + bytesRead);
		var i = buffer_utils.find_last(self.delimiter, n, bytesRead);
		//console.error("DEBUG: i = " + i);
		
		// If there was no new lines, we need to read more.
		if(!i) {
			//console.error("DEBUG: Didn't find buffer delimiters...");
			
			// Resize buffer if we need more space
			if(last_buffer_len + bytesRead >= last_buffer.length) {
				//console.error("DEBUG: Resizing buffer...");
				tmp = new Buffer(last_buffer_len + bytesRead);
				last_buffer.copy(tmp, 0, 0, last_buffer_len);
				last_buffer = tmp;
				//console.error("DEBUG: last_buffer = '" + last_buffer.slice(0, last_buffer_len) + "'" );
			}
			
			// Copy readed bytes to our local buffer
			//console.error("DEBUG: Copying readed bytes to local buffer...");
			n.copy(last_buffer, last_buffer_len, 0, bytesRead);
			last_buffer_len += bytesRead;
			//console.error("DEBUG: last_buffer = " + last_buffer.slice(0, last_buffer_len) + "'");
			return;
		}
		
		// Prepare buffer
		//console.error("DEBUG: Preparing temporary buffer...");
		var b, b_size;
		if(last_buffer_len !== 0) {
			b = Buffer.concat([last_buffer.slice(0, last_buffer_len), n.slice(0, i+1)], last_buffer_len + i+1);
			b_size = last_buffer_len + i+1;
		} else {
			b = n.slice(0, i+1);
			b_size = i+1;
		}
		//console.error("DEBUG: b = '" + b.slice(0, b_size) + "'");
		
		// Emit data
		self.emit('data', b, b_size);
		
		// Copy leftovers to last_buffer
		if(i+1 < bytesRead) {
			//console.error("DEBUG: Copying leftovers to last_buffer...");
			n.copy(last_buffer, 0, i+1, bytesRead);
			last_buffer_len = bytesRead - (i+1);
			//console.error("DEBUG: last_buffer = '" + last_buffer.slice(0, last_buffer_len) + "'");
		} else {
			last_buffer_len = 0;
		}

	});
	self.internal.on('end', function() {
		//console.error("DEBUG: Emitting data event with '" + str + "'");
		self.emit('data', last_buffer.slice(0, last_buffer_len), last_buffer_len);
		//console.error("DEBUG: Emitting end event");
		self.emit('end');
	});
	self.has_listeners = true;
}

/* Start reading */
VariableReadStream.prototype.read = function(amount) {
	var self = this;
	if(!self.has_listeners) init_listeners(self);
	return self.internal.read(amount);
};

// Export as module
module.exports = VariableReadStream;

/* EOF */

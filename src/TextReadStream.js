/* Interface implementing TextReadStream */

var fs = require('fs');
var util = require('util');
var errors = require('./errors.js');
var q = require('q');
var EventEmitter = require('events').EventEmitter;
var VariableReadStream = require('./VariableReadStream.js');

/** */
function TextReadStream(file, opts) {
	var self = this;
	EventEmitter.call(self);
	opts = opts || {};
	self.encoding = opts.encoding || 'utf8';
	self.delimiter = (opts.delimiter || '\n');
	opts.delimiter = self.delimiter.charCodeAt(0);
	self.internal = new VariableReadStream(file, opts);
}
util.inherits(TextReadStream, EventEmitter);

/** Internal builder for listeners */
function init_listeners(self) {
	self.internal.on('data', function(b, b_size) {
		// Emit data as utf8 strings
		var str = b.toString(self.encoding || 'utf8', 0, b_size);
		//console.error("DEBUG: Emitting data event with '" + str + "'");
		self.emit('data', str);
	});
	self.internal.on('end', function() {
		self.emit('end');
	});
	self.has_listeners = true;
}

/* Start reading */
TextReadStream.prototype.read = function(amount) {
	var self = this;
	if(!self.has_listeners) init_listeners(self);
	return self.internal.read(amount);
};

// Export as module
module.exports = TextReadStream;

/* EOF */


/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var errors = require('./errors.js');
var mod = module.exports = {};

/** Find last index for value in a buffer */
mod.find_last = function(value, buffer, len) {
	var i = parseInt(len || buffer.length, 10)-1;
	for(; i>=0; i=i-1) {
		if(buffer[i] === value) {
			return i;
		}
	}
	return;
};

/** Split buffer into slices */
mod.split = function(value, buffer, len) {
	len = len || buffer.length;
	var records = [];
	var i, last_i = -1;
	for(i=0; i<len; i+=1) {
		if(buffer[i] === value) {
			records.push(buffer.slice(last_i+1, i));
			last_i = i;
		}
	}
	if(last_i+1 <= i) records.push(buffer.slice(last_i+1, i));
	return records;
};

/* EOF */

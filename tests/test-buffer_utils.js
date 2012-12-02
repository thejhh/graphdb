/* Conform feature tests */

var testCase = require('nodeunit').testCase;
var File = require('../src/File.js');
var errors = require('../src/errors.js');
var buffer_utils = require('../src/buffer_utils.js');

module.exports = testCase({
	setUp: function (callback) {
		var self = this;
		// Create buffer with AA#BB##CC#DD
		var buffer = new Buffer(12);
		buffer.fill('A', 0, 2);
		buffer.fill('#', 2, 3);
		buffer.fill('B', 3, 5);
		buffer.fill('#', 5, 7);
		buffer.fill('C', 7, 9);
		buffer.fill('#', 9, 10);
		buffer.fill('D', 10, 12);
		self.buffer = buffer;
		callback();
	},
	tearDown: function (callback) {
		var self = this;
		callback();
	},
	/* */
	test_find_last: function(test){
		test.expect(2);
		var self = this;
		var i;

		i = buffer_utils.find_last('#'.charCodeAt(0), self.buffer, 12);
		test.strictEqual(9, i);

		i = buffer_utils.find_last('#'.charCodeAt(0), self.buffer, 6);
		test.strictEqual(5, i);

		test.done();
	},
	/* */
	test_split: function(test){
		test.expect(10);
		var self = this;
		var pieces;

		pieces = buffer_utils.split('#'.charCodeAt(0), self.buffer, 12);
		test.strictEqual(pieces.length, 5);
		test.strictEqual(pieces[0].toString('utf8'), "AA");
		test.strictEqual(pieces[1].toString('utf8'), "BB");
		test.strictEqual(pieces[2].toString('utf8'), "");
		test.strictEqual(pieces[3].toString('utf8'), "CC");
		test.strictEqual(pieces[4].toString('utf8'), "DD");

		pieces = buffer_utils.split('#'.charCodeAt(0), self.buffer, 6);
		test.strictEqual(pieces.length, 3);
		test.strictEqual(pieces[0].toString('utf8'), "AA");
		test.strictEqual(pieces[1].toString('utf8'), "BB");
		test.strictEqual(pieces[2].toString('utf8'), "");

		test.done();
	}
});

/* EOF */

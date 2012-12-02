/* Conform feature tests */

var testCase = require('nodeunit').testCase;
var File = require('../src/File.js');
var errors = require('../src/errors.js');

module.exports = testCase({
	setUp: function (callback) {
		var self = this;
		callback();
	},
	tearDown: function (callback) {
		var self = this;
		callback();
	},
	/* */
	test_open: function(test){
		test.expect(1);
		var self = this;
		var buffer = new Buffer(10);
		var file;
		File.open('files/hello.txt', 'r').then(function(f) {
			file = f;
			return f.read(buffer, 0, 10);
		}).then(function(data) {
			var str = data.buffer.toString('utf8', 0, data.bytesRead);
			test.strictEqual( str, 'Hello\nWorl');
		}).fin(function() {
			test.done();
			if(file) return file.close();
		}).fail(function(err) {
			errors.print(err);
		}).done();
	}
});

/* EOF */

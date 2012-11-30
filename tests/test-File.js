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
		}).then(function(bytesRead, b) {
			var str = buffer.toString('utf8', 0, bytesRead);
			test.strictEqual( str, 'Hello\nWorl');
		}).then(function() {
			return file.close();
		}).then(function() {
			test.done();
		}, function(err) {
			test.done();
			errors.print(err);
		});
	}
});

/* EOF */

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
		}).then(function() {
			return file.close();
		}).then(function() {
			test.done();
		}, function(err) {
			test.done();
			errors.print(err);
		}).done();
	},
	/* */
	test_stream: function(test){
		test.expect(1);
		var self = this;
		var offset = 0;
		var buffer = new Buffer(1000);
		buffer.fill('#');
		//console.error("test-File.js: DEBUG: Opening file for stream test...");
		File.open('files/hello.txt', 'r').then(function(f) {
			var s = new File.ReadStream(f, {buffer_size:10});
			s.on('data', errors.catchfail(function(bytesRead, b) {
				b.copy(buffer, offset, 0, bytesRead);
				offset += bytesRead;
			}));
			s.on('end', errors.catchfail(function() {
				var str = buffer.toString('utf8', 0, offset);
				test.strictEqual( str, 'Hello\nWorld\nIsn\'t\nit a\nGood day!\n');
			}));
			s.read().fin(function() {
				test.done();
			}).fail(function(err) {
				errors.print(err);
			}).done();
		}, function(err) {
			errors.print(err);
			test.done();
		}).done();
	}
});

/* EOF */

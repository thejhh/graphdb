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
	},
	/* */
	test_binary_stream: function(test){
		test.expect(1);
		var self = this;
		var offset = 0;
		var buffer = new Buffer(1000);
		var file;
		buffer.fill('#');
		//console.error("test-File.js: DEBUG: Opening file for stream test...");
		File.open('files/hello.txt', 'r').then(function(f) {
			file = f;
			var s = new File.ReadStream(f, {buffer_size:10});
			s.on('data', errors.catchfail(function(b, bytesRead) {
				b.copy(buffer, offset, 0, bytesRead);
				offset += bytesRead;
			}));
			s.on('end', errors.catchfail(function() {
				var str = buffer.toString('utf8', 0, offset);
				test.strictEqual( str, 'Hello\nWorld\nIsn\'t\nit a\nGood day!\n');
			}));
			return s.read();
		}).fin(function() {
			test.done();
			if(file) return file.close();
		}).fail(function(err) {
			errors.print(err);
		}).done();
	},
	/* */
	test_variable_binary_stream: function(test){
		test.expect(1);
		var self = this;
		var buffer = "";
		var file;
		//console.error("test-File.js: DEBUG: Opening file for stream test...");
		File.open('files/hello.txt', 'r').then(function(f) {
			file = f;
			var s = new File.VariableReadStream(f, {buffer_size:10, delimiter:'\n'});
			s.on('data', errors.catchfail(function(data, len) {
				buffer += data.toString('utf8', 0, len);
			}));
			s.on('end', errors.catchfail(function() {
				test.strictEqual( buffer, 'Hello\nWorld\nIsn\'t\nit a\nGood day!\n');
			}));
			return s.read();
		}).fin(function() {
			test.done();
			if(file) return file.close();
		}).fail(function(err) {
			errors.print(err);
		}).done();
	},
	/* */
	test_text_stream: function(test){
		test.expect(1);
		var self = this;
		var buffer = "";
		var file;
		//console.error("test-File.js: DEBUG: Opening file for stream test...");
		File.open('files/hello.txt', 'r').then(function(f) {
			file = f;
			var s = new File.TextReadStream(f, {buffer_size:10});
			s.on('data', errors.catchfail(function(data) {
				buffer += data;
			}));
			s.on('end', errors.catchfail(function() {
				test.strictEqual( buffer, 'Hello\nWorld\nIsn\'t\nit a\nGood day!\n');
			}));
			return s.read();
		}).fin(function() {
			test.done();
			if(file) return file.close();
		}).fail(function(err) {
			errors.print(err);
		}).done();
	}
});

/* EOF */

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
	test_variable_stream: function(test){
		test.expect(1);
		var self = this;
		var buffer = "";
		var file;
		//console.error("test-File.js: DEBUG: Opening file for stream test...");
		File.open('files/hello.txt', 'r').then(function(f) {
			file = f;
			var s = new File.VariableReadStream(f, {buffer_size:10, delimiter:'\n'.charCodeAt(0)});
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
	}
});

/* EOF */

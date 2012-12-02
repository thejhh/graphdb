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
	test_text_stream: function(test){
		var results = [
			'Hello\n',
			'World\nIsn\'t\n',
			'it a\n',
			'Good day!\n'
		];
		test.expect(2 + results.length);
		var self = this;
		var buffer = "";
		var file;
		//console.error("test-File.js: DEBUG: Opening file for stream test...");
		File.open('files/hello.txt', 'r').then(function(f) {
			file = f;
			var s = new File.TextReadStream(f, {buffer_size:10});
			var i = 0;
			s.on('data', errors.catchfail(function(data) {
				test.strictEqual(data, results[i]);
				buffer += data;
				i += 1;
			}));
			s.on('end', errors.catchfail(function() {
				test.strictEqual( i, 4 );
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

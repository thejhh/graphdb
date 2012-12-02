/* Conform feature tests */

var testCase = require('nodeunit').testCase;
var IndexFile = require('../src/IndexFile.js');
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
		IndexFile.rebuild("../src/data/nodes.json").then(function(indexfile) {
			//test.strictEqual( indexfile.get(0), 'Hello\nWorl');
		}).fin(function() {
			test.done();
		}).fail(function(err) {
			errors.print(err);
		}).done();
	}
});

/* EOF */

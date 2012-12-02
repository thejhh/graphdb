/* Conform feature tests */

var testCase = require('nodeunit').testCase;
var q = require('q');
var File = require('../src/File.js');
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
		// FIXME: Copy data file into temporary file before continuing
		var data_file = "../src/data/nodes.json";
		var tmp_data_file = "tmp/nodes.json";
		var tmp_index_file = "tmp/nodes.index";
		File.copy(data_file, tmp_data_file).then(function() {
			return IndexFile.rebuild(tmp_data_file).then(function(indexfile) {
			});
		}).fin(function() {
			test.done();
			return q.all([File.unlink(tmp_data_file), File.unlink(tmp_index_file)]);
		}).fail(function(err) {
			errors.print(err);
		}).done();
	}
});

/* EOF */

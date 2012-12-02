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
		test.expect(4*7);
		var self = this;
		// FIXME: Copy data file into temporary file before continuing
		var data_file = "../src/data/nodes.json";
		var tmp_data_file = "tmp/nodes.json";
		var tmp_index_file = "tmp/nodes.index";
		File.copy(data_file, tmp_data_file).then(function() {
			return IndexFile.rebuild(tmp_data_file).then(function(indexfile) {
				var promises = [];
				promises.push(indexfile.get(0).then(function(i) {
					test.strictEqual( i.id, 0, "id for #0 invalid: " + i);
					test.strictEqual( i.offset, 0, "offset for #0 invalid: " + i);
					test.strictEqual( i.length, 8, "length for #0 invalid: " + i);
					test.strictEqual( ''+i, '#0@0-7(8)', "toString for #0 invalid: " + i);
				}));

				promises.push(indexfile.get(1).then(function(i) {
					test.strictEqual( i.id, 1, "id for #1 invalid: " + i);
					test.strictEqual( i.offset, 9, "offset for #1 invalid: " + i);
					test.strictEqual( i.length, 30, "length for #1 invalid: " + i);
					test.strictEqual( ''+i, '#1@9-38(30)', "toString for #1 invalid: " + i);
				}));

				promises.push(indexfile.get(2).then(function(i) {
					test.strictEqual( i.id, 2, "id for #2 invalid: " + i);
					test.strictEqual( i.offset, 40, "offset for #2 invalid: " + i);
					test.strictEqual( i.length, 30, "length for #2 invalid: " + i);
					test.strictEqual( ''+i, '#2@40-69(30)', "toString for #2 invalid: " + i);
				}));
				
				promises.push(indexfile.get(3).then(function(i) {
					test.strictEqual( i.id, 3, "id for #3 invalid: " + i);
					test.strictEqual( i.offset, 71, "offset for #3 invalid: " + i);
					test.strictEqual( i.length, 30, "length for #3 invalid: " + i);
					test.strictEqual( ''+i, '#3@71-100(30)', "toString for #3 invalid: " + i);
				}));
				
				promises.push(indexfile.get(4).then(function(i) {
					test.strictEqual( i.id, 4, "id for #4 invalid: " + i);
					test.strictEqual( i.offset, 102, "offset for #4 invalid: " + i);
					test.strictEqual( i.length, 47, "length for #4 invalid: " + i);
					test.strictEqual( ''+i, '#4@102-148(47)', "toString for #4 invalid: " + i);
				}));
				
				promises.push(indexfile.get(5).then(function(i) {
					test.strictEqual( i.id, 5, "id for #5 invalid: " + i);
					test.strictEqual( i.offset, 150, "offset for #5 invalid: " + i);
					test.strictEqual( i.length, 47, "length for #5 invalid: " + i);
					test.strictEqual( ''+i, '#5@150-196(47)', "toString for #5 invalid: " + i);
				}));
				
				promises.push(indexfile.get(6).then(function(i) {
					test.strictEqual( i.id, 6, "id for #6 invalid: " + i);
					test.strictEqual( i.offset, 198, "offset for #6 invalid: " + i);
					test.strictEqual( i.length, 47, "length for #6 invalid: " + i);
					test.strictEqual( ''+i, '#6@198-244(47)', "toString for #6 invalid: " + i);
				}));
				
				return q.all(promises);
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

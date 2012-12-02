/* Conform feature tests */

var testCase = require('nodeunit').testCase;
var Index = require('../src/Index.js');
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
	test_create: function(test){
		test.expect(4);
		var self = this;
		var i = new Index({'id':0, 'offset':0, 'length': 10});
		test.strictEqual( i.id, 0);
		test.strictEqual( i.offset, 0);
		test.strictEqual( i.length, 10);
		test.strictEqual( ''+i, '#0@0+10');
		test.done();
	}
});

/* EOF */

/* Conform feature tests */

var testCase = require('nodeunit').testCase;
var Reader = require('../src/Reader.js');
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
	test_1: function(test){
		var self = this;
		var r = new Reader(8);
		test.expect(4);
		
		r.open('files/hello.txt').then(function() {
			r.readLines().then(function(rows) {
				test.strictEqual( JSON.stringify(rows), '["Hello"]');
				
				r.readLines().then(function(rows) {
					test.strictEqual( JSON.stringify(rows), '["World"]');
					r.readLines().then(function(rows) {
						test.strictEqual( JSON.stringify(rows), '["Isn\'t"]');
						r.readLines().then(function(rows) {
							test.strictEqual( JSON.stringify(rows), '["it a"]');
							r.readLines().then(function(rows) {
								test.strictEqual( JSON.stringify(rows), '["Good day!"]');
								r.readLines().then(function(rows) {
									test.strictEqual( JSON.stringify(rows), '[]');
									test.done();
								}, function(err) {
									errors.print(err);
									test.done();
								});
							}, function(err) {
								errors.print(err);
								test.done();
							});
						}, function(err) {
							errors.print(err);
							test.done();
						});
					}, function(err) {
						errors.print(err);
						test.done();
					});
				}, function(err) {
					errors.print(err);
					test.done();
				});
			}, function(err) {
				errors.print(err);
				test.done();
			});
		}, function(err) {
			errors.print(err);
			test.done();
		});
		
	}
});

/* EOF */

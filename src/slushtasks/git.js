'use strict';

var git = require('gulp-git');

module.exports = function (defaults) {
	defaults = defaults || require('../defaults');

	var gulp = defaults.require.gulp;

	gulp.task('git-init', function (done) {
		// nice one, but is git initialized?
		git.init(function (err) {
			done(err, true);
		});
	});

	gulp.task('git-create-branches', function (done) {
		git.branch('develop', function (err) {
			done(err, true);
		});
	});

	gulp.task('git-checkout-develop', function (done) {
		git.checkout('develop', function (err) {
			done(err, true);
		});
	});
};

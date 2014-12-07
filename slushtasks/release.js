var gutil = require('gulp-util'),
	git = require('gulp-git');

module.exports = function (options) {

	var gulp = options.gulp;

	gulp.task('moo', function () {
		git.checkout('master', function (err) {
			if (err) throw err;
		});
	});

};

'use strict';

var defaults = require('./src/defaults');
console.log('defaults', defaults);


var concat = require('gulp-concat'),
	conflict = require('gulp-conflict'),
	common = require('./src/common')(defaults),
	extend = require('extend'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	template = require('gulp-template');

gulp.task('readme', function (done) {

	var readme = extend({}, defaults, defaults.bower);
	gutil.log('Preparing README files');
	common.prepareReadme(readme, function () {
		gulp.src(defaults.globs.docs.readme.generator.src)
			.pipe(template(readme))
			.pipe(concat(defaults.globs.docs.readme.generator.dest))
			.pipe(conflict(defaults.globs.docs.readme.generator.dest))
			.pipe(gulp.dest('./kak'))
			.on('end', function (err) {
				if (err) {
					gutil.log(gutil.colors.red('Failed to create generator readme.'));
				} else {
					gutil.log('Project readme created.');
				}

				done(err, true);
			});
	});
});


gulp.task('test', function () {
	var src = ['slushfile.js', './src/**/*.js'];
	var testSrc = ['./test/**/*.js'];
	return gulp.src(src)
		.pipe(istanbul({
			includeUntested: true
		}))
		.pipe(istanbul.hookRequire())
		.on('end', function () {
			gulp.src(testSrc)
				.pipe(jasmine())
				.pipe(istanbul.writeReports({
					dir: './reports/unit-test-coverage',
					reporters: ['lcov'],
					reportOpts: {
						dir: './reports/unit-test-coverage'
					}
				}))
				.on('error', gutil.log);
		});
});

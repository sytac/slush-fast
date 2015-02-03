'use strict';


var concat = require('gulp-concat'),
	defaults = require('./src/defaults'),
	conflict = require('gulp-conflict'),
	common = require('./src/common')(defaults),
	extend = require('extend'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	seq = require('run-sequence'),
	scaffolding = require('./src/scaffolding'),
	template = require('gulp-template');

// Add release tasks
require('gulp-release-tasks')(gulp);

gulp.task('readme', function (done) {
	var gitUser = scaffolding.getGitUser();
	gitUser = gitUser || {};

	var readme = extend({
		authorEmail: gitUser.email || ''
	}, defaults, defaults.bower);
	gutil.log('Preparing README files');
	common.prepareReadme(defaults.globs.docs.readme.includes.src, readme,
		function () {
			gulp.src(defaults.globs.docs.readme.generator.src)
				.pipe(template(readme))
				.pipe(concat(defaults.globs.docs.readme.generator.dest))
				.pipe(conflict(defaults.globs.docs.readme.generator.dest))
				.pipe(gulp.dest('./'))
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


gulp.task('release', function (done) {
	seq('readme', 'bump', 'commit', done);
});

gulp.task('test', function () {
	var src = ['./src/**/*.js'];
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

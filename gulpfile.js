'use strict';


var concat = require('gulp-concat'),
	defaults = require('./src/defaults'),
	conflict = require('gulp-conflict'),
	common = require('./src/common')(defaults),
	extend = require('extend'),
	git = require('gulp-git'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	seq = require('run-sequence'),
	scaffolding = require('./src/scaffolding'),
	tagVersion = require('gulp-tag-version'),
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

gulp.task('r', function (done) {
	seq(
		'git-switch-to-develop-branch',
		'git-check-for-changes', 'git-bump',
		'git-add-and-commit-develop',
		'git-merge-develop-into-master',
		'git-push-master', 'git-push-tags', done);
});

gulp.task('git-bump', function () {
	return gulp.src(['./package.json'])
		.pipe(tagVersion({
			prefix: ''
		}));
});

gulp.task('git-add-and-commit-develop', function () {
	var packageJson = require('./package.json');
	var version = packageJson.version;

	return gulp.src(['./package.json'])
		.pipe(git.add())
		.pipe(git.commit('Bump to ' + version));

});

gulp.task('git-checkout-master-branch', function (done) {
	git.checkout('master', done);
});

gulp.task('git-merge-develop-into-master', function (done) {
	git.merge('develop', done);
});

gulp.task('git-push-develop', function (done) {
	git.push('origin', 'develop', done);
});
gulp.task('git-push-master', function (done) {
	git.push('origin', 'master', done);
});

gulp.task('git-push-tags', function (done) {
	git.push('origin', 'master', {
		args: '--tags'
	}, done);
});

gulp.task('git-switch-to-develop-branch', function (done) {
	git.checkout('develop', function (err) {
		gutil.log('You are now on branch develop');
		done(err, true);
	});
});

gulp.task('git-check-for-changes', function (done) {
	git.status({
		args: '--porcelain'
	}, function (err, stdout) {
		if (err) {
			done(err, true);
		} else {
			if (stdout.length) {
				gutil.log('You have outstanding changes. Please commit these first');
			} else {
				done();
			}
		}
	});
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

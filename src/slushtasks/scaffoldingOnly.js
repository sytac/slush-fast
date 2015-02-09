'use strict';

var install = require('gulp-install');

module.exports = function (defaults) {
	defaults = defaults || require('../defaults');
	var src = defaults.paths.src;

	var config = require(src + '/config');

	var gulp = defaults.require.gulp;

	var seq = require('gulp-sequence')
		.use(gulp);

	gulp.task('create-so', ['git-init'], function (done) {
		defaults.configs.generator = {
			type: 'scaffolding-only'
		};
		defaults.isNew = true;

		config.prompts.chooseGeneratorType(defaults)
			.then(function () {
				create(done);
			});
	});

	gulp.task('install-so-npm-modules', function (done) {
		if (!defaults.configs.meta.installNpm) {
			done();
		} else {
			return gulp.src('./package.json')
				.pipe(install());
		}
	});

	function create(done) {
		seq(
			[
				'update-bower',
				'update-npm'
			],
			'install-so-npm-modules',
			done);
	}

	return {
		create: create
	};
};

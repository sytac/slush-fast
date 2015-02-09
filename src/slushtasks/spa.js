'use strict';

var install = require('gulp-install');
var path = require('path');

module.exports = function (defaults) {
	defaults = defaults || require('../defaults');
	var src = defaults.paths.src;

	var config = require(src + '/config');

	var conflict = defaults.require.conflict,
		gulp = defaults.require.gulp,
		prettify = defaults.require.prettify,
		rename = defaults.require.rename,
		template = defaults.require.template;

	var seq = require('gulp-sequence')
		.use(gulp);

	var globs = defaults.globs;

	gulp.task('create-spa', ['git-init'], function (done) {
		defaults.configs.generator = {
			type: 'spa'
		};
		defaults.isNew = true;

		config.prompts.chooseGeneratorType(defaults)
			.then(function () {
				create(done);
			});
	});

	gulp.task('copy-spa-files', function () {
		var butNot = [globs.generators.spa.bootstrap.src, globs.generators.spa.index
				.src, globs.generators.spa.gulpfile
				.src,
				globs.generators.spa.bower.src, globs.generators.spa.npm.src
			]
			.map(
				function (glob) {
					return '!' + glob;
				});

		return gulp.src([defaults.globs.generators.spa.templates].concat(
				butNot))
			.pipe(template(defaults))
			.pipe(rename(function (file) {
				if (file.basename[0] === '_') {
					file.basename = '.' + file.basename.slice(1);
				}
			}))
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'));
	});

	gulp.task('create-bootstrap-module', function () {

		return gulp.src([
				defaults.paths.templates + '/module/module.js'
				/*, templates + '/module/module.scenario.js' */
			])
			.pipe(rename(function (path) {
				path.basename = defaults.module.name + '.' + path.basename;
			}))
			.pipe(template(defaults))
			.pipe(prettify(defaults.settings.prettify))
			.pipe(conflict('./src/app/' + defaults.module.name +
				path.sep))
			.pipe(gulp.dest('./src/app/' + defaults.module.name +
				path.sep));
	});

	gulp.task('copy-spa-special-files', function () {

		return gulp.src([globs.generators.spa.bootstrap.src, globs.generators.spa.index
				.src, globs.generators.spa.gulpfile
				.src
			])
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'));
	});

	gulp.task('install-spa-npm-modules', function (done) {
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
			], [
				'copy-spa-files',
				'copy-spa-special-files'
			], [
				'create-bootstrap-module'
			],
			'install-spa-npm-modules',
			done);
	}

	return {
		create: create
	};
};

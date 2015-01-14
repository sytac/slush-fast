var _s = require('underscore.string'),
	file = require('gulp-file'),
	gutil = require('gulp-util'),
	conflict = require('gulp-conflict'),
	path = require('path'),
	prettify = require('gulp-jsbeautifier'),
	randomString = require('random-string'),
	rename = require('gulp-rename'),
	tap = require('gulp-tap'),
	template = require('gulp-template');

module.exports = function (options) {
	var bower = options.bower;
	var src = options.src;
	var templates = options.templates;
	var utils = require(src + '/utils');
	var prompts = require(src + '/prompts');

	var scaffolding = require(src + '/scaffolding');
	var common = require(src + '/common')(options);

	var gulp = options.gulp;


	gulp.task('module', function (done) {
		var ns = scaffolding.ns('.');
		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: ns.join('.')
			}
		};

		if (gulp.args.length) {
			transport.module.newNs = gulp.args.join(' ');
		}

		prompts.moduleName(transport)
			.then(scaffolding.moduleName)
			.then(function (transport) {
				gulp.src([
						templates + '/module/module.js'
						/*, templates + '/module/module.scenario.js' */
					])
					.pipe(rename(function (path) {
						path.basename = transport.module.name + '.' + path.basename;
					}))
					.pipe(template(transport))
					.pipe(prettify(options.prettify))
					.pipe(conflict(transport.module.name + '/'))
					.pipe(gulp.dest(transport.module.name + '/'))
					.on('finish', function () {
						common.writeTempFile('js', ns.length)
							.on('finish', function () {
								done();
							});

					});
			});
	});
};

var gutil = require('gulp-util'),
	conflict = require('gulp-conflict'),
	prettify = require('gulp-jsbeautifier'),
	rename = require('gulp-rename'),
	template = require('gulp-template');

module.exports = function (options) {
	var bower = options.bower;
	var src = options.src;
	var templates = options.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');
	var common = require(src + '/common')(options);

	var gulp = options.gulp;

	gulp.task('directive', function (done) {
		var ns = scaffolding.ns('.');
		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: ns
					.join('.')
			},
			directive: {}
		};

		if (gulp.args.length) {
			transport.directive.newName = gulp.args.join(' ');
		}

		prompts.directiveName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.directiveName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.directive*'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.directive
							.slug);
					}))
					.pipe(template(transport))
					.pipe(prettify(options.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						common.writeTempFile('partials', ns.length)
							.on('finish', function () {
								done();
							});
					});
			})
			.catch(function (err) {
				gutil.log(err);
			});
	});
};

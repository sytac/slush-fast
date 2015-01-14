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

	var gulp = options.gulp;

	gulp.task('factory', function (done) {

		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			},
			factory: {}
		};

		if (gulp.args.length) {
			transport.factory.newName = gulp.args.join(' ');
		}

		prompts.factoryName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.factoryName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.factory*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.factory.slug);
					}))
					.pipe(template(transport))
					.pipe(prettify(options.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						done();
					});
			})
			.catch(function (err) {
				gutil.log(err);
			});
	});
};

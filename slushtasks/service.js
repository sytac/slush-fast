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

	gulp.task('service', function (done) {

		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			},
			service: {}
		};

		if (gulp.args.length) {
			transport.service.newName = gulp.args.join(' ');
		}

		prompts.serviceName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.serviceName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.service*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.service.slug);
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

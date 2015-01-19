'use strict';

module.exports = function (options) {
	options = options || require('../defaults');

	var bower = options.configs.bower;
	var src = options.paths.src;
	var templates = options.paths.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');

	var conflict = options.require.conflict,
		gulp = options.require.gulp,
		gutil = options.require.gutil,
		prettify = options.require.prettify,
		rename = options.require.rename,
		template = options.require.template;

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
					.pipe(prettify(options.settings.prettify))
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

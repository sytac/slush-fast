'use strict';
module.exports = function (defaults) {
	defaults = defaults || require('../defaults');

	var generator = defaults.configs.generator;
	var src = defaults.paths.src;
	var templates = defaults.paths.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');
	var common = require(src + '/common')(defaults);

	var conflict = defaults.require.conflict,
		gulp = defaults.require.gulp,
		gutil = defaults.require.gutil,
		prettify = defaults.require.prettify,
		rename = defaults.require.rename,
		template = defaults.require.template;

	gulp.task('controller', function (done) {

		var transport = {
			module: {
				prefix: generator.prefix,
				ns: scaffolding.ns('.', defaults.configs.generator.srcDir)
					.join('.')
			},
			controller: {}
		};

		if (gulp.args.length) {
			transport.controller.newName = gulp.args.join(' ');
		}

		prompts.controllerName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.controllerName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.controller*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.controller
							.slug);
					}))
					.pipe(template(transport))
					.pipe(prettify(defaults.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						common.writeTempFile('controllers', defaults.paths.temp.freak +
								'/js')
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

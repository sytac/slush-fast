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

	gulp.task('constant', function (done) {

		var transport = {
			module: {
				prefix: generator.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			},
			constant: {}
		};

		if (gulp.args.length) {
			transport.constant.newName = gulp.args.join(' ');
		}

		prompts.constantName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.constantName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.constant*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.constant.slug);
					}))
					.pipe(template(transport))
					.pipe(prettify(defaults.settings.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						common.writeTempFile('constants', defaults.paths.temp.freak +
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

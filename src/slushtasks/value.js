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
		prettify = defaults.require.prettify,
		rename = defaults.require.rename,
		template = defaults.require.template;

	gulp.task('value', function (done) {

		var transport = {
			module: {
				prefix: generator.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			},
			value: {}
		};

		if (gulp.args.length) {
			transport.value.newName = gulp.args.join(' ');
		}

		prompts.valueName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.valueName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.value*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.value.slug);
					}))
					.pipe(template(transport))
					.pipe(prettify(defaults.settings.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						common.writeTempFile('value', defaults.paths.temp.freak +
								'/js')
							.on('finish', function () {
								done();
							});
					});
			})
			.catch(function (err) {
				console.log(err);
			});
	});
};

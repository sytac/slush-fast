'use strict';

module.exports = function (defaults) {
	defaults = defaults || require('../defaults');

	var generator = defaults.configs.generator;
	var src = defaults.paths.src;
	var templates = defaults.paths.templates;
	var templates = defaults.paths.templates;
	var scaffolding = require(src + '/scaffolding');
	var common = require(src + '/common')(defaults);

	var conflict = defaults.require.conflict,
		gulp = defaults.require.gulp,
		prettify = defaults.require.prettify,
		rename = defaults.require.rename,
		template = defaults.require.template;


	gulp.task('config', function (done) {
		// transport will be handed along all thennables
		var transport = {
			module: {
				prefix: generator.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			}
		};
		scaffolding.moduleName(transport)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.config*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.module.name);
					}))
					.pipe(template(transport))
					.pipe(prettify(defaults.settings.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						common.writeTempFile('configs', defaults.paths.temp.freak +
								'/js')
							.on('finish', function () {
								done();
							});
					});
			});
	});

};

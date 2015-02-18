'use strict';
var path = require('path');
module.exports = function (defaults) {
	defaults = defaults || require('../defaults');

	var generator = defaults.configs.generator;
	var src = defaults.paths.src;
	var templates = defaults.paths.templates;
	var prompts = require(src + '/prompts');

	var scaffolding = require(src + '/scaffolding');
	var common = require(src + '/common')(defaults);

	var conflict = defaults.require.conflict,
		gulp = defaults.require.gulp,
		prettify = defaults.require.prettify,
		rename = defaults.require.rename,
		template = defaults.require.template;


	gulp.task('module', function (done) {
		var ns = scaffolding.ns('.', defaults.configs.generator.srcDir);
		var transport = {
			module: {
				prefix: generator.prefix,
				ns: ns.join('.')
			}
		};

		if (gulp.args.length) {
			transport.module.newNs = gulp.args.join(' ');
		}

		var templateFileName = generator.type === 'spa' ? 'module-spa.js' :
			'module.js';

		prompts.moduleName(transport)
			.then(scaffolding.moduleName)
			.then(function (transport) {

				gulp.src([
						templates + '/module/' + templateFileName
					])
					.pipe(rename(function (path) {
						path.basename = transport.module.name + '.module';
					}))
					.pipe(template(transport))
					.pipe(prettify(defaults.settings.prettify))
					.pipe(conflict(transport.module.name + path.sep))
					.pipe(gulp.dest(transport.module.name + path.sep))
					.on('finish', function () {
						common.writeTempFile('module', defaults.paths.temp.freak +
								'/js')
							.on('finish', function () {
								done();
							});

					});
			});
	});
};

'use strict';

module.exports = function (options) {
	var bower = options.configs.bower;
	var src = options.paths.src;
	var templates = options.paths.templates;
	var prompts = require(src + '/prompts');

	var scaffolding = require(src + '/scaffolding');
	var common = require(src + '/common')(options);

	var conflict = options.require.conflict,
		gulp = options.require.gulp,
		prettify = options.require.prettify,
		rename = options.require.rename,
		template = options.require.template;


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
					.pipe(prettify(options.settings.prettify))
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

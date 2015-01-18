'use strict';

module.exports = function (options) {
	var bower = options.configs.bower;
	var src = options.paths.src;
	var templates = options.paths.templates;
	var scaffolding = require(src + '/scaffolding');

	var conflict = options.require.conflict,
		gulp = options.require.gulp,
		prettify = options.require.prettify,
		rename = options.require.rename,
		template = options.require.template;

	gulp.task('run', function (done) {
		// transport will be handed along all thennables
		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			}
		};
		scaffolding.moduleName(transport)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.run*.js'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.module.name);
					}))
					.pipe(template(transport))
					.pipe(prettify(options.settings.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						done();
					});
			});
	});

};

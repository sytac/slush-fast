module.exports = function (options) {
	var bower = options.configs.bower;
	var src = options.paths.src;
	var templates = options.paths.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');

	var conflict = options.require.conflict,
		gulp = options.require.gulp,
		gutil = options.require.gutil,
		prettify = options.require.prettify,
		rename = options.rename,
		template = options.template;

	gulp.task('controller', function (done) {

		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: scaffolding.ns('.')
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

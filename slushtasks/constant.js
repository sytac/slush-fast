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

	gulp.task('constant', function (done) {

		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
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

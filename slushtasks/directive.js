module.exports = function (options) {
	var bower = options.configs.bower;
	var src = options.paths.src;
	var templates = options.paths.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');
	var common = require(src + '/common')(options);

	var conflict = options.require.conflict,
		gulp = options.require.gulp,
		gutil = options.require.gutil,
		prettify = options.require.prettify,
		rename = options.rename,
		template = options.template;

	gulp.task('directive', function (done) {
		var ns = scaffolding.ns('.');
		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: ns
					.join('.')
			},
			directive: {}
		};

		if (gulp.args.length) {
			transport.directive.newName = gulp.args.join(' ');
		}

		prompts.directiveName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.directiveName)
			.then(function (transport) {
				gulp.src([templates + '/module/**/module.directive*'])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.directive
							.slug);
					}))
					.pipe(template(transport))
					.pipe(prettify(options.prettify))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						common.writeTempFile('partials', ns.length)
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

var gutil = require('gulp-util'),
	conflict = require('gulp-conflict'),
	prettify = require('gulp-jsbeautifier'),
	rename = require('gulp-rename'),
	template = require('gulp-template');

module.exports = function (options) {
	var bower = options.bower;
	var src = options.src;
	var templates = options.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');

	var gulp = options.gulp;

	gulp.task('provider', function (done) {

		var transport = {
			module: {
				prefix: bower.project.angular.prefix,
				ns: scaffolding.ns('.')
					.join('.')
			},
			provider: {}
		};

		if (gulp.args.length) {
			transport.provider.newName = gulp.args.join(' ');
		}

		prompts.providerName(transport)
			.then(scaffolding.moduleName)
			.then(scaffolding.providerName)
			.then(function (transport) {
				var partSubName = transport.provider.partSubName;
				transport[partSubName] = transport.provider;

				gulp.src([templates + '/module/**/module.provider*.js',
						templates + '/module/**/module.' + partSubName + '.spec.js'

					])
					.pipe(rename(function (path) {
						path.basename = path.basename.replace('module', transport.provider.slug);
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

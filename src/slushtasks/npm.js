'use strict';

var conflict = require('gulp-conflict'),
	extend = require('extend'),
	gutil = require('gulp-util'),
	fs = require('fs'),
	jeditor = require('gulp-json-editor');

module.exports = function (defaults) {
	defaults = defaults || require('../defaults');
	var gulp = defaults.require.gulp;
	var globs = defaults.globs;

	gulp.task('update-npm', function (done) {
		if (typeof defaults.configs.meta.useNpm !== 'undefined' && defaults.configs
			.meta.useNpm === false) {
			done();
		} else {
			var generatorConfig = defaults.configs.generator;
			if (!generatorConfig) {
				gutil.log('defaults.configs.generator missing, skipping');
				done();
			} else if (defaults.configs.meta && defaults.configs.meta.usePackageManager ===
				false) {
				gutil.log('Skipping npm');
				done();
			} else {
				var type = generatorConfig.type;
				var hasNpm = fs.existsSync(globs.generators[type].npm.target);
				var npmSrc = globs.generators[type].npm[hasNpm ? 'target' :
					'src'];
				var meta = defaults.configs.meta;

				gulp.src(npmSrc)
					.pipe(jeditor(function (json) {
						extend(json, {
							name: generatorConfig.name.slug, // string
							description: generatorConfig.description, // string
							version: '0.0.0', // string
							contributors: [{
								name: meta.userName,
								email: meta.authorEmail
							}], // array
							repository: meta.repositoryUrl
						});
						return json;
					}))
					.pipe(conflict('./'))
					.pipe(gulp.dest('./'))
					.on('finish', function () {
						done();
					});
			}
		}
	});
};

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


	gulp.task('update-bower', function (done) {
		var generatorConfig = defaults.configs.generator;

		if (!generatorConfig) {
			gutil.log('defaults.configs.generator missing, skipping');
			done();
		} else {
			var meta = defaults.configs.meta;

			var type = generatorConfig.type;

			var hasBower = fs.existsSync(globs.generators[type].bower.target);
			var bowerSrc = globs.generators[type].bower[hasBower ? 'target' :
				'src'];

			var freakDependencies = {
				'angular': 'http://www.klm.com/ams/frontend/js/angular/angular-afkl.js',
				'core-en': 'http://www.klm.com/ams/frontend/css/core-en.css',
				'requirejs': 'http://core.static-afkl.com/ams/frontend/require-afkl.js',
				'freak-core': 'http://www.klm.com/ams/frontend/js/g-core-v2.js',
				'freak-local': 'http://apps.static-afkl.com/travel/nl_en/static/js/local.js'
			};

			var regularDependencies = {
				'angular': '~1.3.11'
			};

			var dependencies = generatorConfig.bowerAddFreakDeps ? freakDependencies :
				regularDependencies;

			gulp.src(bowerSrc)
				.pipe(jeditor(function (json) {
					extend(json, {
						name: generatorConfig.name.slug, // string
						description: generatorConfig.description, // string
						version: '0.0.0', // string
						authors: [{
							name: meta.userName,
							email: meta.authorEmail
						}], // array or object, in our case an array
						repository: meta.repositoryUrl,
						dependencies: dependencies
					});

					return json;
				}))
				.pipe(conflict('./'))
				.pipe(gulp.dest('./'))
				.on('finish', function () {
					done();
				});
		}
	});
};

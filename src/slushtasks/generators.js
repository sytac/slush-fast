// choose-generator-type
'use strict';

module.exports = function (defaults) {
	defaults = defaults || require('../defaults');
	var src = defaults.paths.src;
	var config = require(src + '/config');
	var spa = require(defaults.paths.slushtasks + '/spa')(defaults);
	var gulp = defaults.require.gulp,
		gutil = defaults.require.gutil;

	gulp.task('choose-generator-type', function (done) {
		// Do we have a generator.json file?
		if (defaults.configs.generator) {
			gutil.log('The generator.json file is already in place');

			config.prompts.chooseGeneratorType(defaults)
				.then(function () {
					gutil.log('Type slush:fast help.');
					done();
				});
		} else {
			config.prompts.chooseGeneratorType(defaults)
				.then(function () {
					var generatorConfig = defaults.configs.generator;
					gutil.log('Let\'s create a', generatorConfig.type, 'project.');
					var f = {
						'spa': spa.create,
						'scaffolding-only': _scaffoldingOnlyGenerator,
						'module': _moduleGenerator
					};
					var generator = f[generatorConfig.type];
					if (generator) {
						generator(done);

					} else {
						done('No generator found for ' + generatorConfig.type, true);
					}
				});
		}
	});

	gulp.task('spa', function (done) {
		defaults.configs.generator = {
			type: 'spa'
		};
		defaults.isNew = true;

		config.prompts.chooseGeneratorType(defaults)
			.then(function () {
				spa.create(done);
			});
	});

	function _moduleGenerator(done) {
		// we have a name

		done();
	}

	function _scaffoldingOnlyGenerator(done) {
		// we have a name

		done();
	}
};

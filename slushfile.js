'use strict';
var defaults = require('./src/defaults');

var figlet = require('figlet'),
	globule = require('globule'),
	gulp = require('gulp'),
	gutil = require('gulp-util');

// add gulp release tasks
require('gulp-release-tasks')(gulp);

// Display idiotic imagery
gutil.log(['', 'Freak Angular Scaffolding Tool', ('FAST'.split(' ')
	.map(function (word) {
		return figlet.textSync(word, {
			font: 'Colossal'
		});
	})
	.join('\n')), 'version: ' + defaults.slush.npm.version].join('\n'));

// Load all task files
globule.find(defaults.paths.slushtasks + '/*')
	.map(function (file) {
		require(file)(defaults);
	});

gulp.task('default', ['choose-generator-type']);

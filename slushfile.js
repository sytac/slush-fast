'use strict';

var defaults = require('./src/defaults'),
	figlet = require('figlet'),
	globule = require('globule'),
	gulp = require('gulp'),
	gutil = require('gulp-util');

// add gulp release tasks
require('gulp-release-tasks')(gulp);

// Display idiotic imagery
gutil.log('\nFreak Angular Scaffolding Tool\n' + ('FAST'.split(' ')
	.map(function (word) {
		return figlet.textSync(word, {
			font: 'colossal'
		});
	})
	.join('\n')));

// Load all task files
globule.find(defaults.paths.slushtasks + '/*')
	.map(function (file) {
		require(file)(defaults);
	});

gulp.task('default', ['create-project']);

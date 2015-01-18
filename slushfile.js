var conflict = require('gulp-conflict'),
	globule = require('globule'),
	figlet = require('figlet'),
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	prettify = require('gulp-jsbeautifier'),
	rename = require('gulp-rename'),
	template = require('gulp-template');
scaffolding = require('./src/scaffolding');


// add gulp release tasks
require('gulp-release-tasks')(gulp);

gutil.log('\nFreak Angular Scaffolding Tool\n' + ('FAST'.split(' ')
	.map(function (word) {
		return figlet.textSync(word, {
			font: 'colossal'
		});
	})
	.join('\n')));

// Options
var options = {
	configs: {
		bower: scaffolding.findBower('.')
	},
	require: {
		gulp: gulp,
		gutil: gutil,
		conflict: conflict,
		prettify: prettify,
		rename: rename,
		template: template
	},

	slush: {
		npm: scaffolding.findNpm(__dirname + '/.')
	},
	paths: {
		slushtasks: __dirname + '/src/slushtasks',
		src: __dirname + '/src',
		docs: __dirname + '/docs',
		templates: __dirname + '/templates'
	},
	settings: {
		prettify: {
			js: {
				braceStyle: "collapse",
				breakChainedMethods: true,
				e4x: false,
				evalCode: false,
				indentChar: " ",
				indentLevel: 0,
				indentSize: 4,
				indentWithTabs: false,
				jslintHappy: false,
				keepArrayIndentation: true,
				keepFunctionIndentation: true,
				maxPreserveNewlines: 10,
				preserveNewlines: true,
				spaceBeforeConditional: true,
				spaceInParen: false,
				unescapeStrings: false,
				wrapLineLength: 0
			}
		}
	}
};

// Load all task files
globule.find(options.paths.slushtasks + '/*')
	.map(function (file) {
		require(file)(options);
	});

gulp.task('default', ['init']);

var globule = require('globule'),
	figlet = require('figlet'),
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	scaffolding = require('./src/scaffolding'),
	sh = require('shelljs');

// add gulp release tasks
require('gulp-release-tasks')(gulp);

gutil.log('\nFreak Angular Scaffolding Tool\n' + ('FAST'.split(' ')
	.map(function (word) {
		return figlet.textSync(word, {
			font: 'colossal'
		});
	})
	.join('\n')));


var bower = scaffolding.findBower('.');
var slushNpm = scaffolding.findNpm(__dirname + '/.');

// Settings
var settings = {

	gulp: gulp,
	bower: bower,
	slush: {
		npm: slushNpm
	},
	src: __dirname + '/src',
	slushtasks: __dirname + '/slushtasks',
	applications: './src/applications',
	modules: './src/modules',
	templates: __dirname + '/templates',
	docs: __dirname + '/docs',
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
	},
	fixmyjs: {
		'asi': true,
		'boss': true,
		'curly': true,
		'eqeqeq': false,
		'eqnull': true,
		'esnext': true,
		'expr': true,
		'forin': true,
		'immed': true,
		'laxbreak': true,
		'newcap': false,
		'noarg': true,
		'node': true,
		'nonew': true,
		'plusplus': true,
		'quotmark': 'single',
		'strict': false,
		'undef': true,
		'unused': true,
		'white': true
	}
};

// Load all task files
globule.find(__dirname + '/slushtasks/*')
	.map(function (file) {
		require(file)(settings);
	});


gulp.task('default', ['init']);

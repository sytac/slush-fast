var globule = require('globule'),
	figlet = require('figlet'),
	gulp = require('gulp'),
	gutil = require('gulp-util');

// add gulp release tasks
require('gulp-release-tasks')(gulp);
/*
gutil.log('\n' + ('TIF Angular Generator'.split(' ')
	.map(function (word) {
		return figlet.textSync(word, {
			font: 'colossal'
		});
	})
	.join('\n')));
 */

// Settings
var settings = {
	gulp: gulp,
	src: __dirname + '/src',
	slushtasks: __dirname + '/slushtasks',
	applications: './src/applications',
	modules: './src/modules',
	templates: __dirname + '/templates',
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

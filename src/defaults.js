'use strict';
var conflict = require('gulp-conflict'),
	globule = require('globule'),
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	prettify = require('gulp-jsbeautifier'),
	rename = require('gulp-rename'),
	template = require('gulp-template'),
	scaffolding = require('./scaffolding');

var defaults = {
	configs: {
		bower: scaffolding.findBower('../')
	},
	require: {
		fs: fs,
		globule: globule,
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
		slushtasks: __dirname + '/slushtasks',
		src: __dirname + '/src/..',
		docs: __dirname + '/../docs',
		templates: __dirname + '/../templates'
	},
	settings: {
		prettify: {
			js: {
				braceStyle: 'collapse',
				breakChainedMethods: true,
				e4x: false,
				evalCode: false,
				indentChar: ' ',
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

module.exports = defaults;

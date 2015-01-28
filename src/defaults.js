'use strict';
var conflict = require('gulp-conflict'),
	globule = require('globule'),
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
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

Object.keys(defaults.paths)
	.map(function (pathId) {
		defaults.paths[pathId] = path.normalize(defaults.paths[pathId]);
	});

defaults.globs = {
	bootstrap: {
		src: defaults.paths.templates + '/application/*/bootstrap.js'
	},
	index: {
		src: defaults.paths.templates + '/application/*/index.html'
	},
	gulpfile: {
		src: defaults.paths.templates + '/application/gulpfile.js'
	},
	npm: {
		src: defaults.paths.templates + '/application/package.json',
		target: './package.json'
	},
	bower: {
		src: defaults.paths.templates + '/application/bower.json',
		target: './bower.json'
	},
	docs: {
		readme: {
			includes: {
				src: defaults.paths.docs + '/**/*.md'
			},
			project: {
				src: defaults.paths.docs + '/README.project.md',
				dest: './README.md'
			},
			generator: {
				src: defaults.paths.docs + '/README.generator.md',
				dest: './README.md'
			}
		}
	}
};

module.exports = defaults;

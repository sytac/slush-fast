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
var generatorConfigResult = scaffolding.findConfig('generator.json', '.');

var generatorConfigTemplate = require(__dirname +
	'/../templates/generator/generator.json');
var root = path.dirname(generatorConfigResult.file);
var defaults = {
	configs: {
		bowerDefaults: {
			'angular': {
				static: 'http://www.klm.com/ams/frontend/js/angular/angular-afkl.js',
				fromRepo: '~1.3.11'
			},
			'core-en': {
				static: 'http://www.klm.com/ams/frontend/css/core-en.css'
			},
			'requirejs': {
				static: 'http://core.static-afkl.com/ams/frontend/require-afkl.js'
			},
			'freak-core': {
				static: 'http://www.klm.com/ams/frontend/js/g-core-v2.js'
			},
			'freak-local': {
				static: 'http://apps.static-afkl.com/travel/nl_en/static/js/local.js'
			}
		},
		generatorConfigTemplate: generatorConfigTemplate,
		generator: generatorConfigResult.config || {
            distDir: 'dist'
        },
		bower: scaffolding.findBower('./'),
		meta: {
			root: root
		}
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
		docs: __dirname + '/../templates/docs',
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

defaults.paths.generators = {
	spa: defaults.paths.templates + '/generators/spa',
	module: defaults.paths.templates + '/generators/module',
	'scaffolding-only': defaults.paths.templates + '/generators/scaffolding-only'
};
defaults.paths.temp = {
	freak: root + '/.tmp/.freak'
};

defaults.globs = {
	temp: {
		freak: defaults.paths.temp.freak + '/**/*'
	},
	generators: {
		spa: {
			templates: defaults.paths.generators.spa + '/**/*',
			bootstrap: {
				src: defaults.paths.generators.spa + '/*/bootstrap.js'
			},
			index: {
				src: defaults.paths.generators.spa + '/*/index.html'
			},
			gulpfile: {
				src: defaults.paths.generators.spa + '/gulpfile.js'
			},
			npm: {
				src: defaults.paths.generators.spa + '/package.json',
				target: './package.json'
			},
			bower: {
				src: defaults.paths.generators.spa + '/bower.json',
				target: './bower.json'
			}
		},
		module: {
			bootstrap: {
				src: defaults.paths.generators.module + '/*/bootstrap.js'
			},
			index: {
				src: defaults.paths.generators.module + '/*/index.html'
			},
			gulpfile: {
				src: defaults.paths.generators.module + '/gulpfile.js'
			},
			npm: {
				src: defaults.paths.generators.module + '/package.json',
				target: './package.json'
			},
			bower: {
				src: defaults.paths.generators.module + '/bower.json',
				target: './bower.json'
			}
		},
		'scaffolding-only': {
			bootstrap: {
				src: defaults.paths.generators['scaffolding-only'] + '/*/bootstrap.js'
			},
			index: {
				src: defaults.paths.generators['scaffolding-only'] + '/*/index.html'
			},
			gulpfile: {
				src: defaults.paths.generators['scaffolding-only'] + '/gulpfile.js'
			},
			npm: {
				src: defaults.paths.generators['scaffolding-only'] + '/package.json',
				target: './package.json'
			},
			bower: {
				src: defaults.paths.generators['scaffolding-only'] + '/bower.json',
				target: './bower.json'
			}
		}
	},

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

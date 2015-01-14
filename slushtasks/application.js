'use strict';
/* global require,process,console,__dirname */
var _ = require('lodash'),
	_s = require('underscore.string'),
	async = require('async'),
	concat = require('gulp-concat'),
	extend = require('extend'),
	globule = require('globule'),
	gulp = require('gulp'),
	conflict = require('gulp-conflict'),
	fs = require('fs'),
	inquirer = require('inquirer'),
	install = require('gulp-install'),
	jeditor = require('gulp-json-editor'),
	multipipe = require('multipipe'),
	rename = require('gulp-rename'),
	path = require('path'),
	prettify = require('gulp-jsbeautifier'),
	Q = require('Q'),
	sh = require('shelljs'),
	template = require('gulp-template'),
	tap = require('gulp-tap'),
	util = require('gulp-util');

module.exports = function (options) {

	var src = options.src;
	var templates = options.templates;
	var scaffolding = require(src + '/scaffolding');
	var prompts = require(src + '/prompts');

	var gulp = options.gulp;
	var seq = require('gulp-sequence')
		.use(gulp);


	var answers;


	var globs = {
		bootstrap: {
			src: options.templates + '/application/*/bootstrap.js'
		},
		index: {
			src: options.templates + '/application/*/index.html'
		},
		gulpfile: {
			src: options.templates + '/application/gulpfile.js'
		},
		npm: {
			src: options.templates + '/application/package.json',
			target: './package.json'
		},
		bower: {
			src: options.templates + '/application/bower.json',
			target: './bower.json'
		},
		docs: {
			readme: {
				includes: {
					src: options.docs + '/**/*.md'
				},
				project: {
					src: options.docs + '/README.project.md',
					dest: './README.md'
				},
				generator: {
					src: options.docs + '/README.generator.md',
					dest: './README.md'
				}
			}
		}
	};

	var defaults = createDefaults();

	gulp.task('readme', function (done) {

		var readme = extend({}, defaults, {
				slushNpm: options.slushNpm
			},
			defaults.bower);
		util.log('Preparing README files', readme);
		prepareReadme(readme, function () {
			gulp.src(globs.docs.readme.project.src)
				.pipe(template(readme))
				.pipe(concat(globs.docs.readme.project.dest))
				.pipe(conflict(globs.docs.readme.project.dest))
				.pipe(gulp.dest('./'))
				.on('end', function (err) {
					if (err) {
						util.log(util.colors.red('Failed to copy files'));
					} else {
						util.log('Files copied');
					}

					done(err, true);
				});
		});
	});

	gulp.task('init', function (done) {
		// prompt for app specific values
		prompts.application(defaults)
			.then(function (answers) {
				extend(defaults, {
					install: answers.install,
					description: answers.appDescription,
					version: answers.appVersion,
					authors: [{
						name: answers.authorName,
						email: answers.authorEmail
					}],
					repository: {
						type: 'git',
						url: answers.appRepository
					}
				});
				extend(defaults.project.name, {
					full: answers.appName,
					slug: _s.slugify(answers.appName)
				});

				extend(defaults.project.angular, {
					prefix: scaffolding.prefixName(answers.appPrefix)
				});
				var bootstrapModuleName = defaults.project.angular.prefix + '.' +
					answers.bootstrapModule;
				extend(defaults.project.angular.bootstrap, {
					module: bootstrapModuleName,
					element: _s.slugify(bootstrapModuleName.split('.')
						.join('-')) + '-app'
				});

				_.extend(defaults, {

					module: {
						prefix: scaffolding.prefixName(answers.appPrefix),
						ns: '',
						newNs: answers.bootstrapModule
					}
				});
				return Q.resolve(defaults);
			})
			.then(scaffolding.moduleName)
			.then(function () {
				seq(
					[
						'create-bower-json',
						'create-package-json'
					], [
						'update-bower-json',
						'update-package-json'
					], [
						'copy-files',
						'copy-special-files'
					],
					'readme', [
						'create-module',
						'create-readme'
					],
					'install-npm-modules',
					done);
			});
	});

	gulp.task('copy-files', function () {
		var butNot = [globs.bootstrap.src, globs.index.src, globs.gulpfile.src,
				globs.bower.src, globs.npm.src
			]
			.map(
				function (glob) {
					return '!' + glob;
				});

		return gulp.src([options.templates + '/application/**/*'].concat(butNot))
			.pipe(template(defaults))
			.pipe(rename(function (file) {
				if (file.basename[0] === '_') {
					file.basename = '.' + file.basename.slice(1);
				}
			}))
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'))
	});

	gulp.task('copy-special-files', function (done) {

		return gulp.src([globs.bootstrap.src, globs.index.src, globs.gulpfile.src])
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'));
	});

	gulp.task('create-module', function (done) {

		return gulp.src([
				options.templates + '/module/module.js'
				/*, templates + '/module/module.scenario.js' */
			])
			.pipe(rename(function (path) {
				path.basename = defaults.module.name + '.' + path.basename;
			}))
			.pipe(template(defaults))
			.pipe(prettify(options.prettify))
			.pipe(conflict('./src/app/' + defaults.module.name +
				'/'))
			.pipe(gulp.dest('./src/app/' + defaults.module.name +
				'/'));


	});
	gulp.task('create-readme', function (done) {
		// references defaults
		done();
	});

	gulp.task('create-bower-json', function (done) {
		if (!fs.existsSync(globs.bower.target)) {
			gulp.src(globs.bower.src)
				.pipe(gulp.dest('./'))
				.on('finish', function () {
					done();
				});
		} else {
			done();
		}
	});


	gulp.task('update-bower-json', function () {
		return gulp.src(globs.bower.target)
			.pipe(jeditor(function (json) {
				extend(json, {
					name: defaults.project.name.slug, // string
					description: defaults.description, // string
					version: defaults.version, // string
					authors: defaults.authors, // array or object, in our case an array
					repository: defaults.repository,
					project: {
						name: defaults.project.name,
						angular: defaults.project.angular,
						includes: defaults.project.includes
					}
				});

				//extend(json.project.name, {}, defaults.project.name);
				//extend(json.project.angular, defaults.project.angular);

				return json;
			}))
			.pipe(gulp.dest('./'));
	});

	// package.json
	gulp.task('create-package-json', function (done) {
		if (!fs.existsSync(globs.npm.target)) {
			gulp.src(globs.npm.src)
				.pipe(gulp.dest('./'))
				.on('finish', function () {
					done();
				});
		} else {
			done();
		}
	});

	gulp.task('update-package-json', function (done) {
		return gulp.src(globs.npm.target)
			.pipe(jeditor(function (json) {
				extend(json, {
					name: defaults.project.name.slug, // string
					description: defaults.description, // string
					version: defaults.version, // string
					contributors: defaults.authors, // array
					repository: defaults.repository // object
				});

				return json;
			}))
			.pipe(gulp.dest('./'));
	});

	gulp.task('install-npm-modules', function (done) {
		if (!defaults.install) {
			done();
		} else {
			return gulp.src('./package.json')
				.pipe(install());
		}
	});


	function prepareReadme(answers, callback) {
		answers.readme = {};

		globule.find(globs.docs.readme.includes.src)
			.map(function (file) {
				var value = fs.readFileSync(file, 'utf8');
				var key = path.basename(file, '.md');
				answers.readme[key] = _.template(value)(answers);
			});
		callback();
	}

	function createDefaults() {

		var bower = scaffolding.findBower('./');
		var templateBower = scaffolding.findBower(options.templates +
			'/application/');
		var npm = scaffolding.findNpm('./');

		var workingDirName = scaffolding.getWorkingDirName();
		var repositoryUrl = scaffolding.getGitRepositoryUrl();
		var gitUser = scaffolding.getGitUser();

		gitUser = gitUser || {};
		var bootstrapModule = '';
		var project = bower.project || templateBower.project;
		extend(project.name, {
			full: workingDirName,
			slug: _s.slugify(workingDirName)
		});
		/*{
			name: {
				full: workingDirName,
				slug: _s.slugify(workingDirName)
			},
			angular: {
				prefix: '',
				bootstrap: {
					module: bootstrapModule,
					element: _s.slugify(bootstrapModule.split('.')
						.join('-')) + '-app'
				}
			}
		};

		*/

		var defaults = {
			authors: bower.authors,
			appName: project.name.slug,
			description: bower.description || '',
			version: bower.version || '0.0.0',
			userName: format(gitUser.name) || osUserName,
			authorEmail: gitUser.email || '',
			mainFile: bower.main || '',
			appRepository: repositoryUrl ? repositoryUrl : '',
			bootstrapModule: bootstrapModule,
			appPrefix: project.angular.prefix,
			bower: bower,
			slush: options.slush,
			slushNpm: options.slushNpm,
			project: project
		};

		if (gitUser) {
			if (gitUser.name) {
				defaults.authorName = gitUser.name;
			}
			if (gitUser.email) {
				defaults.authorEmail = gitUser.email;
			}
		}

		return defaults;
	}
};

function installNpmModules(callback) {
	var pipe = multipipe(gulp.src('./package.json'), install());

	pipe.on('end', function () {
		util.log('Modules installed');
		callback(null, true);
	});

	pipe.on('data', function (data) {
		return data;
	});

	pipe.on('error', callback);
}

function getBowerConfig() {
	var bower = {};
	var bowerConfig = 'bower.json';
	if (fs.existsSync('./' + bowerConfig)) {
		bower = require(sh.pwd() + '/' + bowerConfig);
	}

	return bower;
}

function getNpmConfig() {
	var npm = {};
	var npmConfig = 'package.json';
	if (fs.existsSync('./' + npmConfig)) {
		npm = require(sh.pwd() + '/' + npmConfig);
	}

	return npm;
}

function format(string) {
	if (string) {

		var username = string.toLowerCase();
		return username.replace(/\s/g, '');
	}
}

function readJSON(path) {
		return JSON.parse(fs.readFileSync(path) + '');
	}
	// new shit



/// old shit
/*
var defaults = (function () {

var homeDir = scaffolding.getHomeDir();
var osUserName = homeDir && homeDir.split('/')
.pop() || 'root';

// throw error when root?

var workingDirName = scaffolding.getWorkingDirName();
var repositoryUrl = scaffolding.getGitRepositoryUrl();
// console.log('repositoryUrl', repositoryUrl);
var gitUser = scaffolding.getGitUser();
// console.log('gitUser', gitUser);
// console.log('bower', bower);
gitUser = gitUser || {};


var bootstrapModule = 'unspecified';

var appPrefix = '';
var appName;
if (bower.project) {

appPrefix = bower.project.angular.prefix;
var bootstrap = bower.project.angular.bootstrap;
if (bootstrap) {
bootstrapModule = bootstrap.module.substr(appPrefix.length + 1);
}
}

var project = bower.project || {
name: {
full: workingDirName,
slug: _s.slugify(workingDirName)
},
angular: {
prefix: appPrefix,
bootstrap: {
module: bootstrapModule,
element: _s.slugify(bootstrapModule.split('.')
.join('-')) + '-app'
}
}
};


var defaultValues = {
authors: bower.authors,
appName: appName,
description: bower.description || '',
version: bower.version || '0.0.0',
userName: format(gitUser.name) || osUserName,
authorEmail: gitUser.email || '',
mainFile: bower.main || '',
appRepository: repositoryUrl ? repositoryUrl : '',
bootstrapModule: bootstrapModule,
appPrefix: appPrefix,
bower: bower,
slush: options.slush,
slushNpm: options.slushNpm,
project: project
};

if (gitUser) {
if (gitUser.name) {
defaultValues.authorName = gitUser.name;
}
if (gitUser.email) {
defaultValues.authorEmail = gitUser.email;
}
}

return defaultValues;
})();
 */

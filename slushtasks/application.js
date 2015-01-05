/*
 * slush-ngmodule
 * https://github.com/darlanalves/slush-ngmodule
 *
 * Copyright (c) 2014, Darlan Alves
 * Licensed under the MIT license.
 */

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
			src: options.templates + '/application/package.json'
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

	var bower = scaffolding.findBower('./');
	var npm = scaffolding.findNpm('./');

	var defaults = (function () {

		var homeDir = scaffolding.getHomeDir();
		var osUserName = homeDir && homeDir.split('/')
			.pop() || 'root';

		// throw error when root?

		var workingDirName = scaffolding.getWorkingDirName();
		var repositoryUrl = scaffolding.getGitRepositoryUrl();
		console.log('repositoryUrl', repositoryUrl);
		var gitUser = scaffolding.getGitUser();
		console.log('gitUser', gitUser);
		console.log('bower', bower);
		var configFile = homeDir + '/.gitconfig';
		gitUser = gitUser || {};


		var bootstrapModule = '';

		var appPrefix = '';

		if (bower.afkl && bower.afkl.angular) {
			appPrefix = bower.afkl.angular.prefix;
			var bootstrap = bower.afkl.angular.bootstrap;
			if (bootstrap) {
				bootstrapModule = bootstrap.module;
				if (appPrefix && bootstrapModule.indexOf(appPrefix + '.') === 0) {
					bootstrapModule = bootstrapModule.substr(appPrefix.length + 1);
				}
			}
		}

		var defaultValues = {
			appName: bower.name || workingDirName,
			appDescription: bower.description || '',
			appVersion: bower.version || '0.0.0',
			userName: format(gitUser.name) || osUserName,
			authorEmail: gitUser.email || '',
			mainFile: bower.main || '',
			appRepository: repositoryUrl ? repositoryUrl : '',
			bootstrapModule: bootstrapModule,
			appPrefix: appPrefix,
			bower: bower,
			slush: options.slush,
			slushNpm: options.slushNpm
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



	var answers;

	gulp.task('readme', function (done) {

		var readme = extend({}, defaults, {
				slushNpm: options.slushNpm
			},
			bower);
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

	gulp.task('do', function (done) {
		// prompt for app specific values
		prompts.application(defaults)
			.then(function (answers) {
				// this only returns answers, nothing else
				// So we have to extend our defaults
				_.extend(defaults, answers, {
					appNameSlug: _s.slugify(answers.appName),
					module: {
						prefix: scaffolding.prefixName(answers.appPrefix),
						ns: '',
						newNs: answers.bootstrapModule
					}
				});
				return Q.resolve(defaults);
			})
			.then(scaffolding.moduleName)
			.then(function (transport) {
				console.log('transport', transport);
				seq([
						'create-bower-json',
						'update-bower-json',
						'create-package-json',
						'update-package-json'
					], [
						'copy-files',
						'copy-special-files'
					], [
						'create-module',
						'create-readme'
					],
					'install-npm-modules', done);
			});
	});

	gulp.task('copy-files', function (done) {
		// references defaults
		done();
	});
	gulp.task('copy-special-files', function (done) {
		// references defaults
		done();
	});
	gulp.task('create-module', function (done) {
		// references defaults
		done();
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
					name: defaults.app.nameSlug, // string
					description: defaults.app.description, // string
					version: defaults.app.version, // string
					authors: defaults.app.authors, // array or object, in our case an array
					repository: defaults.app.repository // object
				});
				var bootstrapModuleName = defaults.module.prefix + '.' + defaults.module
					.fullNs;
				extend(json.afkl, {
					angular: {
						prefix: defaults.module.prefix,
						bootstrap: {
							module: bootstrapModuleName,
							element: _s.slugify(bootstrapModuleName.split('.')
								.join('-')) + '-app'
						}
					}
				})
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
		// references defaults
		done();
	});
	gulp.task('install-npm-modules', function (done) {
		// references defaults
		done();
	});


	gulp.task('init', function (done) {

		var newApplicationPrompts = prompts.application(defaults);

		function askAndExecuteTasks() {
			inquirer.prompt(newApplicationPrompts,
				function (answers) {
					if (!answers.moveon) {
						Object.keys(answers)
							.forEach(function (key) {
								if (key in defaults) {
									defaults[key] = answers[key];
								}
							});
						console.log('\n');
						return askAndExecuteTasks();
					}

					answers.appNameSlug = _s.slugify(answers.appName);

					var transport = {
						module: {
							prefix: scaffolding.prefixName(answers.appPrefix),
							ns: '',
							newNs: answers.bootstrapModule
						}
					};

					scaffolding.moduleName(transport)
						.then(function (transport) {
							answers.module = transport.module;
							async.series([


								function (callback) {
									var readme = extend({}, answers, bower, {
										slushNpm: slushNpm
									});
									util.log('Parsing and copying files');
									copyFiles(readme, callback);
								},

								function (callback) {
									util.log('Copying files');
									copySpecialFiles(answers, callback);
								},

								function (callback) {
									var transport = {
										module: {
											ns: '',
											prefix: answers.appPrefix,
											newNs: answers.bootstrapModule
										}
									};

									scaffolding.moduleName(transport)
										.then(function (transport) {
											gulp.src([
													templates + '/module/module.js'
													/*, templates + '/module/module.scenario.js' */
												])
												.pipe(rename(function (path) {
													path.basename = transport.module.name + '.' + path.basename;
												}))
												.pipe(template(transport))
												.pipe(prettify(options.prettify))
												.pipe(conflict('./src/app/' + transport.module.name + '/'))
												.pipe(gulp.dest('./src/app/' + transport.module.name +
													'/'))
												.on('finish', function () {
													callback();
												});
										});

								},

								function (callback) {
									util.log('Creating manifest files');
									createPackageFiles(answers, callback);
								},
								function (callback) {
									util.log('Preparing README files');
									var readme = extend({}, answers, {
										slushNpm: slushNpm
									}, bower);
									prepareReadme(readme, callback);
								},
								function (callback) {
									if (answers.install) {
										util.log('Installing NPM modules');
										installNpmModules(callback);
										return;
									}

									callback();
								}
							], function (err) {
								if (err) util.log(util.colors.red('[error] ') + err);

								done();
							});
						});

				});
		}



		function createPackageFiles(answers, callback) {
			var bower = getBowerConfig(),
				npm = getNpmConfig();

			if (answers.userName) {
				bower.repository = npm.repository = {
					'type': 'git',
					'url': 'git://github.com/' + answers.userName + '/' + answers.appName +
						'.git'
				};
			}

			if (answers.authorName) {
				var author = answers.authorName;

				if (answers.authorEmail) {
					author = {
						name: answers.authorName,
						email: answers.authorEmail
					};
				}

				bower.author = npm.author = author;
			}

			bower.private = answers.private;
			bower.repository = npm.repository = answers.appRepository;

			bower.main = './dist/module.js';
			npm.main = './dist/index.js';
			bower.afkl.angular = {
				prefix: answers.module.prefix,
				bootstrapModule: answers.module.prefix + '.' + answers.module.fullNs
			};

			bower.afkl.angular.bootstrapElement = _s.slugify(bower.afkl.angular.bootstrapModule
					.split('.')
					.join('-')) +
				'-app';

			fs.writeFileSync('./bower.json', JSON.stringify(bower, null, '\t'));
			fs.writeFileSync('./package.json', JSON.stringify(npm, null, '\t'));

			callback(null, true);
		}



		function copyFiles(answers, callback) {
			var butNot = [globs.bootstrap.src, globs.index.src, globs.gulpfile.src]
				.map(
					function (glob) {
						return '!' + glob;
					});
			var pipe = multipipe(
				gulp.src([options.templates + '/application/**/*'].concat(butNot)),
				template(answers),
				rename(function (file) {
					if (file.basename[0] === '_') {
						file.basename = '.' + file.basename.slice(1);
					}
				}),
				conflict('./'),
				gulp.dest('./')
			);

			pipe.on('data', function (data) {
				return data;
			});

			pipe.on('error', callback);

			pipe.on('end', function (err) {
				if (err) {
					util.log(util.colors.red('Failed to copy files'));
				} else {
					util.log('Files copied');
				}

				callback(err, true);
			});
		}

		function copySpecialFiles(answers, callback) {

			var pipe = multipipe(
				gulp.src([globs.bootstrap.src, globs.index.src, globs.gulpfile.src]),
				conflict('./'),
				gulp.dest('./')
			);

			pipe.on('data', function (data) {
				return data;
			});

			pipe.on('error', callback);

			pipe.on('end', function (err) {
				if (err) {
					util.log(util.colors.red('Failed to copy files'));
				} else {
					util.log('Files copied');
				}

				callback(err, true);
			});
		}



		askAndExecuteTasks();

	});

	function prepareReadme(answers, callback) {
		answers.readme = {};

		globule.find(globs.docs.readme.includes.src)
			.map(function (file) {
				console.log('file', file);
				var value = fs.readFileSync(file, 'utf8');
				var key = path.basename(file, '.md');
				answers.readme[key] = _.template(value)(answers);
			});
		callback();
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

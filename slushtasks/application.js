/*
 * slush-ngmodule
 * https://github.com/darlanalves/slush-ngmodule
 *
 * Copyright (c) 2014, Darlan Alves
 * Licensed under the MIT license.
 */

'use strict';
/* global require,process,console,__dirname */
var _ = require('underscore.string'),
	async = require('async'),
	gulp = require('gulp'),
	conflict = require('gulp-conflict'),
	fs = require('fs'),
	inquirer = require('inquirer'),
	install = require('gulp-install'),
	multipipe = require('multipipe'),
	rename = require('gulp-rename'),
	prettify = require('gulp-jsbeautifier'),
	sh = require('shelljs'),
	template = require('gulp-template'),
	tap = require('gulp-tap'),
	util = require('gulp-util');

module.exports = function (options) {

	var src = options.src;
	var templates = options.templates;
	var scaffolding = require(src + '/scaffolding');

	var gulp = options.gulp;
	gulp.task('init', function (done) {
		var defaults = (function () {
			var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
				workingDirName = process.cwd()
				.split('/')
				.pop()
				.split('\\')
				.pop(),
				osUserName = homeDir && homeDir.split('/')
				.pop() || 'root',
				configFile = homeDir + '/.gitconfig',
				user = {};

			if (fs.existsSync(configFile)) {
				var existingUser = require('iniparser')
					.parseSync(configFile)
					.user;
				if (existingUser) {
					user = existingUser;
				}
			}

			var bower = getBowerConfig();
			var npm = getNpmConfig();
			var bootstrapModule = '';
			var appPrefix = '';
			if (bower.afkl && bower.afkl.angular && bower.afkl.angular.bootstrapModule) {
				bootstrapModule = bower.afkl.angular.bootstrapModule;
				appPrefix = bower.afkl.angular.appPrefix;
			}

			var defaultValues = {
				appName: bower.name || workingDirName,
				appDescription: bower.description || '',
				appVersion: bower.version || '0.0.0',
				userName: format(user.name) || osUserName,
				authorEmail: user.email || '',
				mainFile: bower.main || '',
				appRepository: bower.repository ? bower.repository.url : '',
				appNs: bootstrapModule,
				appPrefix: appPrefix
			};

			if (typeof bower.author === 'object') {
				defaultValues.authorName = bower.author.name;
				if (bower.author.email) defaultValues.authorEmail = bower.author.email;
			} else {
				defaultValues.authorName = bower.author;
			}

			return defaultValues;
		})();

		var prompts = [{
				name: 'appName',
				message: 'What is the name of your project?',
				default: defaults.appName
			},
			/* {
							name: 'appPrefix',
							message: 'What is the prefix of your project? (for example: tif., ltc. or prds.)',
							default: defaults.appPrefix,
							validate: function (value) {
								var done = this.async();
								if (!value) {
									done('Please provider a namespace');
								} else {
									done(true);
								}
							}
						} , */
			{
				name: 'appNs',
				message: 'What is the bootstrap module of your project? (for example: app, example, toolbar, world-domination)',
				default: defaults.appNs,
				validate: function (value) {
					var done = this.async();
					if (!value) {
						done('Please provider a namespace');
					} else {
						done(true);
					}
				}
			}, {
				name: 'appDescription',
				message: 'What is the description?',
				default: defaults.appDescription
			}, {
				name: 'appVersion',
				message: 'What is the version of your project?',
				default: defaults.appVersion
			}, {
				name: 'authorName',
				message: 'What is the author name?',
				default: defaults.authorName
			}, {
				name: 'authorEmail',
				message: 'What is the author email?',
				default: defaults.authorEmail
			}, {
				name: 'userName',
				message: 'What is the github username?',
				default: defaults.userName
			}, {
				name: 'appRepository',
				message: 'Repository URL',
				default: defaults.appRepository
			}, {
				type: 'confirm',
				name: 'private',
				message: 'Mark as a private package?'
			},

			{
				type: 'confirm',
				name: 'install',
				message: 'Install npm dependencies?'
			},

			{
				type: 'confirm',
				name: 'moveon',
				message: 'Continue?'
			}
		];

		function askAndExecuteTasks() {
			inquirer.prompt(prompts,
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

					answers.appNameSlug = _.slugify(answers.appName);
					answers.slush = {
						repositoryUrl: 'http://'
					};

					var transport = {
						module: {
							prefix: answers.appPrefix,
							ns: '',
							newNs: answers.appNs
						}
					};

					scaffolding.moduleName(transport)
						.then(function (transport) {
							answers.module = transport.module;
							async.series([

								function (callback) {
									util.log('Copying files');
									copyFiles(answers, callback);
								},

								function (callback) {
									util.log('Copying files');
									copySpecialFiles(answers, callback);
								},

								function (callback) {
									var transport = {
										module: {
											ns: '',
											newNs: answers.appNs
										}
									};

									scaffolding.moduleName(transport)
										.then(function (transport) {
											gulp.src([templates + '/module/module.js'])
												.pipe(rename(function (path) {
													path.basename = path.basename.replace('module',
														transport.module
														.name);
												}))
												.pipe(template(transport))
												.pipe(prettify(options.prettify))
												.pipe(conflict('./src/app/' + transport.module.name + '/'))
												.pipe(gulp.dest('./src/app/' + transport.module.name + '/'))
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
				bootstrapModule: answers.module.fullNs
			};

			fs.writeFileSync('./bower.json', JSON.stringify(bower, null, '\t'));
			fs.writeFileSync('./package.json', JSON.stringify(npm, null, '\t'));

			callback(null, true);
		}

		var globs = {
			bootstrap: {
				src: options.templates + '/application/*/bootstrap.js'
			},
			index: {
				src: options.templates + '/application/*/index.html'
			},
			gulpfile: {
				src: options.templates + '/application/gulpfile.js'
			}
		};


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

		function format(string) {
			if (string) {

				var username = string.toLowerCase();
				return username.replace(/\s/g, '');
			}
		}

		function readJSON(path) {
			return JSON.parse(fs.readFileSync(path) + '');
		}

		askAndExecuteTasks();

	});
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

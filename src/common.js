'use strict';

var _ = require('lodash'),
	_s = require('underscore.string'),
	extend = require('extend'),
	file = require('gulp-file'),
	path = require('path'),
	randomString = require('random-string'),
	scaffolding = require('./scaffolding');

module.exports = function (defaults) {
	defaults = defaults || require('./defaults');
	var fs = defaults.require.fs,
		paths = defaults.paths,
		globule = defaults.require.globule,
		gulp = defaults.require.gulp;

	var common = {
		writeTempFile: writeTempFile,
		prepareReadme: prepareReadme,
		createDefaults: createDefaults
	};

	return common;



	function createDefaults() {

			var bower = defaults.configs.bower;

			var templateBower = scaffolding.findBower(defaults.paths.templates +
				'/application/');

			var workingDirName = scaffolding.getWorkingDirName();
			var repositoryUrl = scaffolding.getGitRepositoryUrl();
			var gitUser = scaffolding.getGitUser();

			gitUser = gitUser || {};
			var bootstrapModule = '';

			var project = bower.project || templateBower.project;

			if (!bower.project) {

				extend(project.name, {
					full: workingDirName,
					slug: _s.slugify(workingDirName)
				});
			}

			var defaults = {
				authors: bower.authors,
				appName: project.name.slug,
				description: bower.description || '',
				version: bower.version || '0.0.0',
				userName: _format(gitUser.name), // TODO: where did this come from? -> || osUserName,
				authorEmail: gitUser.email || '',
				mainFile: bower.main || '',
				appRepository: repositoryUrl ? repositoryUrl : '',
				bootstrapModule: bootstrapModule,
				appPrefix: project.angular.prefix,
				bower: bower.project ? bower : templateBower,
				slush: defaults.slush,
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
			console.log('defaults', defaults);
			return defaults;
		}
		/**
		 * Reads all md files from the docs directory and puts them into an object
		 * @param {Object}   answers  The answers object that's being passed to the templates
		 * @param {Function} callback Async callback
		 */
	function prepareReadme(src, answers, callback) {
		// if answers is not there create it
		if (!answers) {
			answers = {};
		}

		// Add readme object
		answers.readme = {};

		// TODO: get rid of globule and do proper async
		// Get all md file references in the docs directory
		globule.find(src)
			.map(function (file) {
				var pathArrays = _.remove(path.relative(paths.docs, path.dirname(file))
					.split(path.sep),
					function (pathPart) {
						if (pathPart !== '') {
							return true;
						}
					});

				return {
					file: file,
					depth: pathArrays
				};
			})
			.sort(function (a, b) {
				if (a.depth.length === b.depth.length) {
					return 0;
				} else if (a.depth.length > b.depth.length) {
					return -1;
				} else {
					return 1;
				}
			})
			.map(function (o) {
				var file = o.file;
				var depth = o.depth;
				var basename = path.basename(file, '.md');

				var current = answers.readme;
				depth
					.map(function (part) {
						// ignore empty strings
						if (part !== '') {
							// namespace it
							if (!current[part]) {
								current[part] = {};
							}
							current = current[part];
						}
					});

				var value = fs.readFileSync(file, 'utf8');

				try {
					current[basename] = _.template(value)(answers);
				} catch (err) {
					console.log('---', err);
				}
			});

		// Check if callback is provided
		if (callback) {
			// Call callback
			callback();
		}
		return answers;
	}


	function writeTempFile(name, dest) {
		return file(name,
				'This temporary file is used for triggering fs watchers.\n' +
				'See https://github.com/floatdrop/gulp-watch/issues/29\n\n' +
				'--------------------\n' +

				randomString({
					length: 20
				}) +
				'\n--------------------\n', {
					src: true
				})
			.pipe(gulp.dest(dest));

	}

	function _format(string) {
		if (string) {

			var username = string.toLowerCase();
			return username.replace(/\s/g, '');
		}
	}

};

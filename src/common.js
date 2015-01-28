'use strict';

var _ = require('lodash'),
	_s = require('underscore.string'),
	file = require('gulp-file'),
	path = require('path'),
	randomString = require('random-string');

module.exports = function (options) {
	options = options || require('./defaults');
	var fs = options.require.fs,
		paths = options.paths,
		globule = options.require.globule,
		gulp = options.require.gulp;

	var common = {
		writeTempFile: writeTempFile,
		prepareReadme: prepareReadme
	};

	return common;

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
					console.log('---', a.depth);
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

	function writeTempFile(name, depth) {
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
			.pipe(gulp.dest(_s.repeat('../', depth) + '/.freak'));

	}

};

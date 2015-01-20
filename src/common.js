'use strict';

var _ = require('lodash'),
	_s = require('underscore.string'),
	file = require('gulp-file'),
	path = require('path'),
	randomString = require('random-string');

module.exports = function (options) {
	console.log('d', options);
	options = options || require('./defaults');
	var fs = options.require.fs,
		globs = options.globs,
		globule = options.require.globule,
		gulp = options.require.gulp;

	var common = {
		writeTempFile: writeTempFile,
		prepareReadme: prepareReadme
	};

	return common;

	function prepareReadme(answers, callback) {
		if (!answers) {
			answers = {};
		}
		answers.readme = {};

		globule.find(globs.docs.readme.includes.src)
			.map(function (file) {
				var value = fs.readFileSync(file, 'utf8');
				var key = path.basename(file, '.md');
				try {
					answers.readme[key] = _.template(value)(answers);
				} catch (err) {
					console.log('---', err);
				}
			});

		if (callback) {
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

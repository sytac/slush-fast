'use strict';

var _s = require('underscore.string'),
	file = require('gulp-file'),
	randomString = require('random-string');

module.exports = function (options) {

	var gulp = options.require.gulp;

	var common = {
		writeTempFile: writeTempFile
	};

	return common;

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

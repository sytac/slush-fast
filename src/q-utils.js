'use strict';

var Q = require('q');

var qUtils = {
	wrap: wrap
};

module.exports = qUtils;

function wrap(fn) {
	return function () {
		var deferred = Q.defer();
		try {
			var result = fn.apply(null, Array.prototype.slice.call(arguments, 0));
			deferred.resolve(result);
		} catch (err) {
			deferred.reject(err);
		}

		return deferred.promise;
	};
}

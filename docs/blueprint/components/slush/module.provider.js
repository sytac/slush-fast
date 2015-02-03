(function () {
	'use strict';

	angular.module('module')
		.provider('moduleService', moduleServiceProvider);

	function moduleServiceProvider() {

		// Returns moduleService
		/* @ngInject */
		this.$get = function () {
			return function () {

			};
		};
	}

}());

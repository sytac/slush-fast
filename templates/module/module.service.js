(function () {
	'use strict';

	angular.module('<%= module.prefixedFullNs %>')
		.service('<%= service.fullNsName %>', <%= service.fullNsName %> );

	function <%= service.fullNsName %> () {
		// values here

		/*jshint validthis: true */
		// this.foo = function or value

		// functions here
	}

}());

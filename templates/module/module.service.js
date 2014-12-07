(function () {
	'use strict';

	angular.module('<%= module.fullNs %>')
		.service('<%= service.name %>', <%= service.name %> );

	function <%= service.name %> () {
		// values here

		// this.foo = function or value

		// functions here
	}

}());

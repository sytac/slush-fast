(function () {
	'use strict';

	angular.module('<%= module.fullNs %>')
		.factory('<%= factory.name %>', <%= factory.name %> );

	function <%= factory.name %> () {
		var factory = function () {

		};

		return factory;
	}

}());

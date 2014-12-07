(function () {
	'use strict';

	angular.module('<%= module.fullNs %>')
		.factory('<%= factory.name %>', <%= factory.name %> );

	function <%= factory.name %> () {
		// values here

		var factory = {
			// member : function or value
		};

		// factory functions here
		return factory;
	}

}());

(function () {
	'use strict';

	angular.module('<%= module.prefixedFullNs %>')
		.factory('<%= factory.fullNsName %>', <%= factory.fullNsName %> );

	function <%= factory.fullNsName %> () {
		// values here

		var factory = {
			// member : function or value
		};

		// factory functions here
		return factory;
	}

}());

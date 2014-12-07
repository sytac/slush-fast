(function () {
	'use strict';

	angular.module('<%= module.fullNs %>')
		.service('<%= service.name %>', <%= service.name %> );

	function <%= service.name %> () {

	}

}());

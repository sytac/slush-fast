(function () {
	'use strict';

	angular.module('<%= module.prefixedFullNs %>')
		.config(config);

	function config($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('root', {

				url: '/',
				// controller: function(){ }
				// templateUrl: ''
			});
	}

}());

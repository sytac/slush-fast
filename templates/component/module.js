angular.module('<%= moduleName %>', [
		'ngRoute'
	])
	.config(function ($routeProvider) {
		'use strict';
		$routeProvider
			.when('/todo', {
				controller: '<%= moduleName %>Ctrl',
				templateUrl: '/<%= moduleName %>/<%= moduleName %>/<%= moduleName %>.html'
			})
			.otherwise({
				redirectTo: '/<%= moduleName %>'
			});
	});

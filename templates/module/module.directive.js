(function () {
	'use strict';

	/* <%= module.name %>.<%= directive.slug %>.directive.js */

	/**
	 * @desc
	 * @example <div <%= directive.slug %>></div>
	 */
	angular
		.module('<%= module.fullNs %>')
		.directive('<%= directive.name %>', <%= directive.upperCaseCamelizedPartName %> );

	function <%= directive.upperCaseCamelizedPartName %> () {
		var directive = {
			restrict: 'EA',
			templateUrl: '<%= module.path %>/<%= module.name %>.<%= directive.slug %>.directive.html',
			controller: <%= directive.upperCaseCamelizedPartName + 'Controller' %> ,
			controllerAs: 'vm'
		};

		return directive;

		/* @ngInject */
		function <%= directive.upperCaseCamelizedPartName + 'Controller' %> () {
			// Injecting $scope just for comparison
			var vm = this;
		}
	}
}());

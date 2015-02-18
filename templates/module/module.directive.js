(function () {
	'use strict';

	/* <%= module.path %>/<%= directive.slug %>.directive.js */

	/**
	 * @desc
	 * @example <div <%= directive.fullNsNameSlug %>></div>
	 */
	angular
		.module('<%= module.prefixedFullNs %>')
		.directive(
			'<%= directive.fullNsName %>', <%=
			directive.upperCaseCamelizedPartName %> );

	function <%= directive.upperCaseCamelizedPartName %> () {
		var directive = {
			restrict: 'A',
			templateUrl: '<%= directive.slug %>.directive.html',
			controller: <%= directive.upperCaseCamelizedPartName + 'Controller' %> ,
			controllerAs: 'vm'
		};

		return directive;

		/* @ngInject */
		function <%= directive.upperCaseCamelizedPartName + 'Controller' %> () {
			// Injecting $scope just for comparison

			/* jshint validthis: true */
			// var vm = this;
		}
	}
}());

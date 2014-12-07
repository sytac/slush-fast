(function () {
	'use strict';

	/* <%= module.name %>.<%= controller.slug %>.controller.js */

	/**
	 * @desc
	 * @example <div ng-controller="<%= controller.upperCaseCamelized %>"></div>
	 */

	angular.module('<%= module.fullNs %>')
		.controller('<%= controller.upperCaseCamelized %>', <%= controller.upperCaseCamelized %> );

	function <%= controller.upperCaseCamelized %> () {

	}

}());

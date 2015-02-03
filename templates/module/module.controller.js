(function () {
	'use strict';

	/* <%= controller.slug %>.controller.js */

	/**
	 * @desc
	 * @example <div ng-controller="<%= controller.fullNsName %> as <%= controller.lowerCaseCamelized %>"></div>
	 */

	angular.module('<%= module.prefixedFullNs %>')
		.controller(
			'<%= controller.fullNsName %>', <%=
			controller.upperCaseCamelized + 'Controller' %> );

	function <%= controller.upperCaseCamelized + 'Controller' %> () {

		/* jshint validthis: true */
		var vm = this;
	}

}());

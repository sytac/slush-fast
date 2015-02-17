(function () {
	'use strict';

	/* <%= filter.slug %>.filter.js */

	/**
	 * @desc
	 * @example <div ng-filter="<%= filter.fullNsName %> as <%= filter.lowerCaseCamelized %>"></div>
	 */

	angular.module('<%= module.prefixedFullNs %>')
		.filter(
			'<%= filter.fullNsName %>', <%=
			filter.upperCaseCamelized + 'filter' %> );

	function <%= filter.upperCaseCamelized + 'filter' %> () {

		return filter;

		function filter() {

		}
	}

}());

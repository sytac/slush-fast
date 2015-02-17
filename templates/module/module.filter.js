(function () {
	'use strict';

	/* <%= filter.slug %>.filter.js */

	/**
	 * @desc
	 * @example <span>{{'some value' | <%= filter.fullNsName %> }}</span>
	 */

	angular.module('<%= module.prefixedFullNs %>')
		.filter(
			'<%= filter.fullNsName %>', <%=
			filter.upperCaseCamelized + 'filter' %> );

	function <%= filter.upperCaseCamelized + 'filter' %> () {

		return filter;

		function filter(value) {
			return '--' + value + '--';
		}
	}

}());

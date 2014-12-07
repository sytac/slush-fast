(function () {
	'use strict';

	angular.module('<%= module.name %>')
		.provider('<%= provider.name %>', <%= provider.camelizedPartName %> );

	function <%= provider.camelizedPartName %> () {

		// Returns <%= provider.name %>
		/* @ngInject */
		this.$get = function () { <%
			if (provider.partName === 'service') { %>
				return function <%= provider.name %> () {

				}; <%
			} else { %>
				return {

				}; <%
			} %>
		};
	}

}());

(function () {
	'use strict';

	angular.module('<%= module.prefixedFullNs %>')
		.provider('<%= provider.fullNsName %>', <%= provider.camelizedPartName %> );

	function <%= provider.camelizedPartName %> () {

		// Returns <%= provider.fullNsName %>
		/* @ngInject */
		this.$get = function () { <%
			if (provider.partName === 'service') { %>
				return function <%= provider.fullNsName %> () {

				}; <%
			} else { %>
				return {

				}; <%
			} %>
		};
	}

}());

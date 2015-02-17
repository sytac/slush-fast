'use strict';

describe(
	'<%= filter.fullNsName %> (filter of <%= module.prefixedFullNs %>)',
	function () {
		var $scope;
		var $el;

		beforeEach(module('<%= module.prefixedFullNs %>'));

		beforeEach(inject(function ($compile, $rootScope) {

			$scope = $rootScope.$new();

			var html = '<div <%= filter.fullNsNameSlug %>>' +
				'</div>';

			$el = angular.element(html);
			$compile($el)($scope);
			$scope.$digest();
		}));
	});

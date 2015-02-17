'use strict';

describe(
	'<%= filter.fullNsName %> (filter of <%= module.prefixedFullNs %>)',
	function () {
		var $scope;
		var $el;

		beforeEach(module('<%= module.prefixedFullNs %>'));

		beforeEach(inject(function ($compile, $rootScope) {

			$scope = $rootScope.$new();

			var html = '<span>{{"some value" | <%= filter.fullNsName %>}}' +
				'</span>';

			$el = angular.element(html);
			$compile($el)($scope);
			$scope.$digest();
		}));

		it('should filter and expression', function () {
			expect($el.html())
				.toBe('--some value--');
		});

		it('should filter by using $filter', inject(function ($filter) {
			var <%= filter.fullNsName %> = $filter('<%= filter.fullNsName %>');

			expect( <%= filter.fullNsName %> ('another value'))
				.toBe('--another value--');
		}));
	});

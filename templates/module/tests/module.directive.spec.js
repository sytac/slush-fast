describe(
	'<%= directive.fullNsName %> (directive of <%= module.prefixedFullNs %>)',
	function () {
		var $scope;
		var $el;

		beforeEach(module('<%= module.prefixedFullNs %>'));

		beforeEach(inject(function ($compile, $rootScope) {

			$scope = $rootScope.$new();

			var html = '<div <%= directive.fullNsNameSlug %>>' +
				'</div>';

			$el = angular.element(html);
			$compile($el)($scope);
			$scope.$digest();
		}));

		it('exposes a .vm reference on the scope', inject(function () {
			expect($scope.vm)
				.toBeDefined();
		}));
	});

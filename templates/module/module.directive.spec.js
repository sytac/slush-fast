describe('<%= directive.name %> (directive of <%= module.fullNs %>)', function () {
	var $scope;
	var $el;

	beforeEach(module('<%= module.fullNs %>'));

	beforeEach(inject(function ($compile, $rootScope) {

		$scope = $rootScope.$new();

		var html = '<div <%= directive.slug %>>' +
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

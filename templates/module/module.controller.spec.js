describe('<%= controller.upperCaseCamelized %> controller', function () {
	'use strict';
	beforeEach(module('<%= module.fullNs %>'));

	var $scope;
	var <%= controller.name %> ;
	var spies = {

	};

	beforeEach(inject(function ($controller, $rootScope) {
		$scope = $rootScope.$new();

		// spies
		// spyOn(injectable, 'function').andCallThrough();

		// instantiate controller
		<%= controller.name %> = $controller(
			'<%= controller.upperCaseCamelized %>', {
				// controller arguments go here

				// $scope: $scope,
				// injectable : injectable
			});
	}));

	it('should be defined', inject(function () {
		expect( <%= controller.name %> )
			.toBeDefined();
	}));

});

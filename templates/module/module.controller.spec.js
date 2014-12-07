describe('<%= controller.upperCaseCamelized %> controller', function () {
	'use strict';
	beforeEach(module('<%= module.fullNs %>'));

	var $scope;
	var <%= controller.name %> ;

	beforeEach(inject(function ($controller, $rootScope) {
		$scope = $rootScope.$new();

		// instantiate controller
		<%= controller.name %> = $controller(
			'<%= controller.upperCaseCamelized %>', {
				// named controller arguments go here
				// for example:
				// $scope: $scope
			});
	}));

	it('should be defined', inject(function () {
		expect( <%= controller.name %> )
			.toBeDefined();
	}));

});

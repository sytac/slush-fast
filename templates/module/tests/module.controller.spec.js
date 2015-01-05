describe(
	'<%= controller.fullNsName %> (controller of <%= module.prefixedFullNs %>)',
	function () {
		'use strict';
		beforeEach(module('<%= module.prefixedFullNs %>'));

		var $scope;
		var <%= controller.fullNsName %> ;

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();

			// instantiate controller
			<%= controller.fullNsName %> =
				$controller(
					'<%= controller.fullNsName %>', {
						// named controller arguments go here
						// for example:
						// $scope: $scope
					});
		}));

		it('should be defined', inject(function () {
			expect( <%= controller.fullNsName %> )
				.toBeDefined();
		}));

	});

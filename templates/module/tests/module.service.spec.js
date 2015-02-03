describe('<%= service.fullNsName %> (service of <%= module.prefixedFullNs %>)',
	function () {
		'use strict';

		beforeEach(module('<%= module.prefixedFullNs %>'));

		it('should be defined', inject(function ( <%= service.fullNsName %> ) {
			expect( <%= service.fullNsName %> )
				.toBeDefined();
		}));

	});

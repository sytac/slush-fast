describe('<%= factory.fullNsName %> (factory of <%= module.prefixedFullNs %>)',
	function () {
		'use strict';

		beforeEach(module('<%= module.prefixedFullNs %>'));

		it('should be defined', inject(function ( <%= factory.fullNsName %> ) {
			expect( <%= factory.fullNsName %> )
				.toBeDefined();
		}));

	});

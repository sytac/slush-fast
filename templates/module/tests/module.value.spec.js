describe('<%= value.fullNsName %> (value of <%= module.prefixedFullNs %>)',
	function () {
		'use strict';

		beforeEach(module('<%= module.prefixedFullNs %>'));

		it('should be defined', inject(function ( <%= value.fullNsName %> ) {
			expect( <%= value.fullNsName %> )
				.toBeDefined();
		}));


		it('should equal \'\'', inject(function ( <%= value.fullNsName %> ) {
			expect( <%= value.fullNsName %> )
				.toEqual('');
		}));

	});

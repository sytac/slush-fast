describe(
	'<%= constant.fullNsName %> (constant of <%= module.prefixedFullNs %>)',
	function () {
		'use strict';

		beforeEach(module('<%= module.prefixedFullNs %>'));

		it('should be defined', inject(function ( <%= constant.fullNsName %> ) {
			expect( <%= constant.fullNsName %> )
				.toBeDefined();
		}));


		it('should equal \'\'', inject(function ( <%= constant.fullNsName %> ) {
			expect( <%= constant.fullNsName %> )
				.toEqual('');
		}));

	});

describe('<%= value.name %> (value of <%= module.fullNs %>)', function () {
	'use strict';

	beforeEach(module('<%= module.fullNs %>'));

	it('should be defined', inject(function ( <%= value.name %> ) {
		expect( <%= value.name %> )
			.toBeDefined();
	}));


	it('should equal \'\'', inject(function ( <%= value.name %> ) {
		expect( <%= value.name %> )
			.toEqual('');
	}));

});

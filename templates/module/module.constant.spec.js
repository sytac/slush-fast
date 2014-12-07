describe('<%= constant.name %> (constant of <%= module.fullNs %>)', function () {
	'use strict';

	beforeEach(module('<%= module.fullNs %>'));

	it('should be defined', inject(function ( <%= constant.name %> ) {
		expect( <%= constant.name %> )
			.toBeDefined();
	}));


	it('should equal \'\'', inject(function ( <%= constant.name %> ) {
		expect( <%= constant.name %> )
			.toEqual('');
	}));

});

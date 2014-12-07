describe('<%= factory.name %> (factory of <%= module.fullNs %>)', function () {
	'use strict';

	beforeEach(module('<%= module.fullNs %>'));

	it('should be defined', inject(function ( <%= factory.name %> ) {
		expect( <%= factory.name %> )
			.toBeDefined();
	}));

});

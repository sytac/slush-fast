describe('<%= service.name %> (service of <%= module.fullNs %>)', function () {
	'use strict';

	beforeEach(module('<%= module.fullNs %>'));

	it('should be defined', inject(function ( <%= service.name %> ) {
		expect( <%= service.name %> )
			.toBeDefined();
	}));

});

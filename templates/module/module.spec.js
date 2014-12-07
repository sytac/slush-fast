describe('<%= module.fullNs %> (module)', function () {
	'use strict';

	beforeEach(module('<%= module.fullNs %>'));


	it('should be defined', inject(function () {
		expect(true)
			.toBeTruthy();
	}));

});

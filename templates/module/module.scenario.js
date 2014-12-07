/* global describe, it */
'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('should test something', function () {


	it('should contain a bootstrap element',
		function () {
			browser.get('/');

			expect(element(by.css('div.my-class'))
					.getAttribute('id'))
				.toBe('banana-app');

		});
});

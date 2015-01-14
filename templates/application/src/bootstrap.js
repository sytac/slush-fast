(function () {

	'use strict';

	angular.element(document)
		.ready(function () {
			angular.bootstrap(document.getElementById(
				'<%= angular.bootstrap.element %>'), [
				'<%= angular.bootstrap.module %>'
			]);
		});

}());

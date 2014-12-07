describe(
	'<%= provider.name %> (provider for <%= provider.partSubName %> of <%= module.fullNs %>)',
	function () {
		'use strict';

		var <%= provider.camelizedPartName %> ;

		beforeEach(function () {

			// Initialize the service provider
			// by injecting it to a fake module's config block
			var fakeModule = angular.module('fake', function () {});
			fakeModule.config(function ( <%= '_' + provider.camelizedPartName +
				'_' %> ) { <%= provider.camelizedPartName %> = <%= '_' +
					provider.camelizedPartName + '_' %> ;

			});
			// Initialize test.app injector
			module('<%= module.fullNs %>', 'fake');
			inject();

		});

		it('should be defined', inject(function () {
			expect( <%= provider.camelizedPartName %> )
				.toBeDefined();
		}));

		<%
		if (provider.partName === 'service') { %>
			it('should provide a function', inject(function ( <%= provider.name %> ) {
				expect( <%= provider.name %> )
					.toEqual(jasmine.any(Function));
			})); <%
		} else { %>
			it('should provide an object', inject(function ( <%= provider.name %> ) {
				expect( <%= provider.name %> )
					.toEqual(jasmine.any(Object));
			})); <%
		} %>
	});

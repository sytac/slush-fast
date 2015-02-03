describe(
	'<%= provider.prefixedFullNs %> (provider for <%= provider.partSubName %> of <%= module.fullNs %>)',
	function () {
		'use strict';

		var <%= provider.fullNsNamePartName %> ;

		beforeEach(function () {

			// Initialize the service provider
			// by injecting it to a fake module's config block
			var fakeModule = angular.module('fake', function () {});
			fakeModule.config(function ( <%= '_' + provider.fullNsNamePartName +
				'_' %> ) { <%= provider.fullNsNamePartName %> = <%= '_' +
					provider.fullNsNamePartName + '_' %> ;

			});
			// Initialize test.app injector
			module('<%= module.prefixedFullNs %>', 'fake');
			inject();

		});

		it('should be defined', inject(function () {
			expect( <%= provider.fullNsNamePartName %> )
				.toBeDefined();
		}));

		<%
		if (provider.partName === 'service') { %>
			it('should provide a function', inject(function ( <%= provider.fullNsName %> ) {
				expect( <%= provider.fullNsName %> )
					.toEqual(jasmine.any(Function));
			})); <%
		} else { %>
			it('should provide an object', inject(function ( <%= provider.fullNsName %> ) {
				expect( <%= provider.fullNsName %> )
					.toEqual(jasmine.any(Object));
			})); <%
		} %>
	});

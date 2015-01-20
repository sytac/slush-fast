'use strict';
var gulp = require('gulp');
var s = require('slush');
var sinon = require('sinon');
require('jasmine-sinon');

var scaffolding = require('../src/scaffolding');

describe('Scaffolding module', function () {
	it('should exist', function () {
		console.log('slush', s);
		expect(scaffolding)
			.toBeDefined();
		expect(scaffolding)
			.toEqual(jasmine.any(Object));
	});

	it('should expose the moduleName function', function () {
		expect(scaffolding.moduleName)
			.toBeDefined();
		expect(scaffolding.moduleName)
			.toEqual(jasmine.any(Function));
	});

	it('should expose the getHomeDir function', function () {

		var s = sinon.sandbox.create()
			.stub(process.env, "HOME", "foo");
		console.log('s', process.env.HOME, s);
		s.restore();
		console.log('s', process.env.HOME);


		expect(scaffolding.getHomeDir)
			.toBeDefined();
		expect(scaffolding.getHomeDir)
			.toEqual(jasmine.any(Function));
		expect(scaffolding.getHomeDir())
			.toBeTruthy();
	});
});

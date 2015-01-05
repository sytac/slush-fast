/* global module */
var wiredep = require('wiredep');
var bowerDependencies = wiredep({
		devDependencies: true
	})
	.packages;
var bowerFiles = []
	.concat.apply([], Object.keys(bowerDependencies)
		.map(function (packageName) {
			return bowerDependencies[packageName].main;
		})
	);


var bowerJson = require('./bower.json');
var fromUrlJs = [];

if (bowerJson.afkl && bowerJson.afkl.includes && bowerJson.afkl.includes.fromUrl &&
	bowerJson.afkl.includes.fromUrl.js) {
	fromUrlJs = Object.keys(bowerJson.afkl.includes.fromUrl.js)
		.map(function (name) {
			var uri = bowerJson.afkl.includes.fromUrl.js[name];
			uri = uri.indexOf('http') === -1 ? 'https:' + uri : uri;
			return uri;
		});
}

module.exports = function (config) {

	var files = fromUrlJs.concat(bowerFiles)
		.concat(['./src/**/*.js', './target/dev/app/**/*templates.js',
			'./src/**/*config.js', './src/**/*run.js',
			'./src/**/*spec.js', '!./src/**/*scenario.js'
		]);

	config.set({
		files: files,

		exclude: ['**/angular.js', '**/bootstrap.js',
			'**/*scenario.js'
		],

		basePath: './',

		// autoWatch : true, // DEVELOPMENT
		singleRun: true,

		frameworks: ['jasmine', 'angular-filesort'],

		browsers: ['PhantomJS'],

		plugins: [
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-angular-filesort',
			'karma-junit-reporter',
			'karma-coverage',
			'karma-html-reporter'
		],

		reporters: ['dots', 'coverage', 'junit', 'html'],

		angularFilesort: {
			whitelist: [
				'./src/**/!(*bootstrap|*config|*run).js'
			]
		},

		// exclude specs
		preprocessors: {
			'./src/**/!(*spec|*scenario).js': ['coverage']
		},

		coverageReporter: {
			reporters: [{
				type: 'html',
				subdir: 'report-html'
			}, {
				type: 'lcov',
				subdir: '.'
			}, {
				type: 'text',
				subdir: '.',
				file: 'text.txt'
			}, {
				type: 'text-summary',
				subdir: '.',
				file: 'text-summary.txt'
			}],
			dir: 'target/reports/karma-coverage',
			subdir: function (browser) {
				if (browser.toLowerCase()
					.indexOf('phantom') !== -1) {
					return 'phantom';
				}
				// normalization process to keep a consistent browser name accross different
				// OS
				return browser;
			},

			file: 'coverage.html'
		},

		junitReporter: {
			outputFile: 'target/reports/TESTS-unit.xml',
			suite: 'unit'
		},

		htmlReporter: {
			outputDir: 'target/reports/jasmine',
			templatePath: __dirname + '/test/jasmine/jasmine-template.html'
		}

	});
};

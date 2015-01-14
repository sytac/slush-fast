// // Caveat emptor
// =============
//
// This file has been generated, and can be overwritten.
// If you thing something's wrong with this file, please
// visit bower.repositoryUrl and submit a pull
// request, contact the maintainer or file a bug.
'use strict';

var angularFilesort = require('gulp-angular-filesort'),
	concat = require('gulp-concat'),
	csslint = require('gulp-csslint'),
	del = require('del'),
	download = require('gulp-download'),
	singleConnect = require('gulp-connect'),
	bowerFiles = require('main-bower-files'),
	browserSync = require('browser-sync'),
	connect = require('gulp-connect-multi'),
	extend = require('extend'),
	fs = require('fs'),
	ghelp = require('gulp-showhelp'),
	globule = require('globule'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	file = require('gulp-file'),
	inject = require('gulp-inject'),
	jshint = require('gulp-jshint'),
	karma = require('gulp-karma'),
	minifyHtml = require('gulp-minify-html'),
	minimist = require('minimist'),
	ngAnnotate = require('gulp-ng-annotate'),
	rimraf = require('rimraf'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	prettify = require('gulp-jsbeautifier'),
	protractor = require('gulp-protractor')
	.protractor,
	sass = require('gulp-sass'),
	seq = require('gulp-sequence')
	.use(gulp),
	symlink = require('gulp-symlink'),
	template = require('gulp-template'),
	templateCache = require('gulp-angular-templatecache'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch');


/**
 * [settings Settings]
 * @type {Object}
 */
var settings = {
	staticAssetTypes: ['js', 'css'],
	uglify: {},
	ngAnnotate: {
		add: true,
		remove: true,
		single_quotes: true
	}
};

/**
 * [paths Directory mappings]
 * @type {Object}
 */
var paths = {
	js: {
		src: 'src/app',
		dev: 'target/dev/app',
		dist: './target/dist/app'
	},
	bootstrap: {
		src: 'src/',
		dev: 'target/dev/app',
		dist: 'target/dist'
	},
	scss: {
		src: 'src',
		dev: 'target/dev'
	},
	fonts: {
		src: './src/fonts/**/*'
	},
	templates: {
		app: {
			src: 'src',
			dist: 'target/dist/app'
		}
	}
};

// Globs
/**
 * [globs Glob mappings]
 * @type {Object}
 */
var globs = {
	js: {
		src: paths.js.src + '/**/!(*spec|*scenario).js',
		dev: paths.js.dev + '/**/*.js'
	},
	scss: {
		src: paths.scss.src + '/**/*.scss',
		dev: paths.scss.dev + '/**/*.css'
	},
	spec: {
		src: paths.js.src + '/**/*spec.js',
	},
	bootstrap: {
		src: paths.bootstrap.src + '/bootstrap.js',
		dev: paths.bootstrap.dev + '/bootstrap.js',
		dist: paths.bootstrap.dist + '/bootstrap.js'
	},
	templates: {
		app: {
			src: paths.templates.app.src + '/**/!(*index).html'
		}
	}
};


// pass arguments
var cliOptions = {
	string: ['host', 'skip-downloads'],
	default: {
		host: 'localhost',
		'skip-downloads': false
	}
};

// Spike 'em with argv
settings = extend(settings, minimist(process.argv.slice(2), cliOptions));

var project = {},
	devServer = connect(),
	coverageServer = connect(),
	jasmineServer = connect(),
	bower = require('./bower.json');

if (bower && bower.project) {
	project = bower.project;

	if (!project.angular) {
		throw new Error('project.angular entry in bower.json missing');
	}

	if (!project.name) {
		throw new Error('project.name entry in bower.json missing');
	}

	if (!project.name.full) {
		throw new Error('project.name.full entry in bower.json missing');
	}
	if (!project.name.slug) {
		throw new Error('project.name.slug entry in bower.json missing');
	}
	if (!project.angular.bootstrap) {
		throw new Error('project.angular.bootstrap entry in bower.json missing');
	}
	if (!project.angular.bootstrap.module) {
		throw new Error(
			'project.angular.bootstrap.module entry in bower.json missing');
	}

	if (!project.includes) {
		project.includes = {};
	}
	if (!project.includes.fromUrl) {
		project.includes.fromUrl = {};
	}

	if (!project.includes.fromUrl.css) {
		project.includes.fromUrl.css = {};
	}
	if (!project.includes.fromUrl.js) {
		project.includes.fromUrl.js = {};
	}
}


gulp.task('help', function () {
		ghelp.show();
	})
	.help = 'shows this help message.';

// kicks off local coverage and dev servers
// will both open in new browser window

gulp.task('dev', function (done) {
		seq(
			'clean', 'clean-caches', [
				'dev-bootstrap',
				'dev-jshint',
				'dev-js',
				'dev-partials',
				'dev-scss'
			], [
				'download-assets',
				'dev-js-template',
				'dev-js-config-run-template', 'dev-js-bootstrap-template',
				'dev-bower-js-template',
				'dev-bower-css-template',
				'dev-css-template'
			],
			'dev-include-scripts',
			'assemble-index',
			'karma',
			'create-phantom-coverage-symlink',
			'dev-server',
			'dev-browsersync',
			'dev-coverage-server',
			'dev-jasmine-server', [
				'watch-bootstrap',
				'watch-js',
				'watch-spec',
				'watch-partials',
				'watch-scss',
				'watch-index-parts'
			]
		)(done);
	})
	.help = {
		'': 'Run the CI environment',
		'--host=localhost': 'Set host domain for local servers, defaults to localhost',
		'--skip-downloads': 'Skip download of static assets, prevents clearing of static download cache'
	};

gulp.task('package', function (done) {
		// clean dist
		// include bootstrap?
		seq('dist-templates', 'dist-js', 'dist-bootstrap', 'dist-js-with-bootstrap',
			done);
	})
	.help = 'Package for production';

gulp.task('dev-protractor', [
		'dev-protractor-server'
	], function (cb) {
		gulp.src('src/**/*scenario.js')
			.pipe(protractor({
				configFile: 'protractor.conf.js',
				args: []
			}))
			.on('error', function (err) {
				throw err;
			})
			.on('end', function () {
				singleConnect.serverClose();
				cb();
			});
	})
	.help = 'Run e2e tests with protractor';

gulp.task('dev-protractor-server', function () {
	singleConnect.server({
		root: ['target/dev', 'bower_components', 'test/mock/'],
		port: 8885
	});
});

// runs tests and copies reports for usage in bamboo
gulp.task('test', function (done) {
		seq('clean-reports', 'karma', 'create-phantom-coverage-symlink', done);
	})
	.help = 'Run tests with karma';

// housekeeping
gulp.task('clean', function (done) {
		rimraf('./target', function () {
			rimraf('./.tmp', function () {
				done();
			});
		});
	})
	.help = 'Clean ./target directory';

gulp.task('clean-caches', function (done) {
		if (settings['skip-downloads'] === false) {
			rimraf('./.cache', function () {
				done();
			});
		} else {
			gutil.log('Skipping cleaning of .cache directory.');
			done();
		}
	})
	.help = 'Clean caches';

gulp.task('clean-reports', function (done) {
		rimraf('./target/reports', function () {
			done();
		});
	})
	.help = 'Clean reports';


gulp.task('clean-jshint', function (done) {
		del('./target/jshint*', function () {
			done();
		});
	})
	.help = 'Clean jshint';

gulp.task('download-assets', function () {
		if (settings['skip-downloads'] === false) {
			var assets = downloadAssets();
			if (!assets.length) {
				gutil.log('No assets to be downloaded');
			} else {

				return download(assets)
					.pipe(gulp.dest('./.cache/static/'));
			}
		} else {
			gutil.log('Skipping asset download');
		}
	})
	.help = 'Download static assets';

// Testing
gulp.task('karma', function (done) {

		var wiredep = require('wiredep');
		var bowerDependencies = wiredep({
			devDependencies: true
		});
		var bowerFiles = bowerDependencies.js;
		/*

		var bowerFiles = []
		.concat.apply([], Object.keys(bowerDependencies)
		.map(function (packageName) {
		return bowerDependencies[packageName].main;
	})
);
*/


		var fromUrlJs = fetchedAssets('js')
			.map(function (uri) {
				return './.cache/static/' + uri.split('/')
					.pop();
			});

		// Why first exclude conf and run files and later include em?
		// Because it affects the loading order of files for the karma preprocessor
		var files = fromUrlJs.concat(bowerFiles)
			.concat(['./src/**/!(*bootstrap|config|run|scenario).js',
				'./target/dev/app/**/*templates.js',
				'./src/**/*config.js', './src/**/*run.js',
				'./src/**/*spec.js'
			]);

		gulp.src(files)
			.pipe(karma({
				configFile: __dirname + '/karma.conf.js',
				action: 'run'
			}))
			.on('error', function () {
				// Make sure failed tests cause gulp to exit non-zero
				done();
			})
			.on('end', function () {
				done();
			});

	})
	.help = 'Run karma';

gulp.task('create-phantom-coverage-symlink', function () {
		return gulp.src('*phantom*.info', {
				cwd: 'target'
			})
			.pipe(symlink('target/reports/karma-coverage/sonar/lcov.info'));
	})
	.help = 'Create lcov symlink for Sonar';


gulp.task('dev-js', function () {
	return gulp.src(globs.js.src)
		.pipe(plumber())
		.pipe(ngAnnotate(settings.ngAnnotate))
		.pipe(gulp.dest(paths.js.dev));
});


gulp.task('dev-jshint', function () {
	return gulp.src(globs.js.src)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-summary', {
			verbose: true,
			reasonCol: 'cyan,bold'
		}))
		.pipe(jshint.reporter('gulp-jshint-file-reporter', {
			filename: './target/jshint-output.log'
		}))
		.pipe(jshint.reporter('gulp-jshint-html-reporter', {
			filename: './target/jshint-output.html'
		}));
});

gulp.task('dev-bootstrap', function () {
	return gulp.src(globs.bootstrap.src)
		.pipe(template(project))
		.pipe(gulp.dest(paths.bootstrap.dev));
});

gulp.task('dev-bower-js-template', function () {
	return file('bower.js.tmpl', '<!-- bower:js --><!-- endinject -->', {
			src: true
		})
		.pipe(inject(gulp.src(bowerFiles(), {
			read: false
		}), {
			name: 'bower',
			ignorePath: '/bower_components'
		}))
		.pipe(gulp.dest('./.tmp'));
});
gulp.task('dev-bower-css-template', function () {
	return file('bower.css.tmpl', '<!-- bower:css --><!-- endinject -->', {
			src: true
		})
		.pipe(inject(gulp.src(bowerFiles(), {
			read: false
		}), {
			name: 'bower',
			ignorePath: '/bower_components'
		}))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('dev-partials', function () {

	return gulp.src(globs.templates.app.src)
		.pipe(minifyHtml({
			empty: true,
			quotes: true,
			loose: true
		}))
		.pipe(templateCache(project.angular.bootstrap.module + '.templates.js', {
			module: project.angular.bootstrap.module
		}))
		.pipe(gulp.dest('./target/dev/app/' + project.angular.bootstrap.module));
});

gulp.task('dev-scss', function () {
	return gulp.src(globs.scss.src)
		.pipe(sass())
		.pipe(gulp.dest(paths.scss.dev))
		.pipe(csslint())
		.pipe(csslint.reporter());
});


gulp.task('dev-js-template', function () {
	return file('app.js.tmpl', '<!-- inject:js --><!-- endinject -->', {
			src: true
		})
		.pipe(inject(
			gulp.src('target/dev/**/!(*bootstrap|*config|*run).js')
			.pipe(angularFilesort()), {
				ignorePath: '/target/dev/',
				whitelist: [
					'./src/**/!(*config|*run).js'
				]
			}))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('dev-js-config-run-template', function () {
	return file('app.jsConfigAndRun.tmpl',
			'<!-- inject:js --><!-- endinject -->', {
				src: true
			})
		.pipe(inject(
			gulp.src(['target/dev/**/*config.js', 'target/dev/**/*run.js']), {
				ignorePath: '/target/dev/'
			}
		))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('dev-js-bootstrap-template', function () {
	return file('app.jsBootstrap.tmpl',
			'<!-- inject:js --><!-- endinject -->', {
				src: true
			})
		.pipe(inject(
			gulp.src(['target/dev/**/*bootstrap.js']), {
				ignorePath: '/target/dev/'
			}
		))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('dev-css-template', function () {
	return file('app.css.tmpl', '<!-- inject:css --><!-- endinject -->', {
			src: true
		})
		.pipe(inject(gulp.src(globs.scss.dev), {
			ignorePath: '/target/dev/'
		}))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('dev-include-scripts-js', function () {
	return includeScripts('js');
});
gulp.task('dev-include-scripts-css', function () {
	return includeScripts('css');
});

gulp.task('dev-include-scripts', function (done) {
	seq('dev-include-scripts-js', 'dev-include-scripts-css', done);
});

gulp.task('assemble-index', function () {
	var data = extend({}, project, {
		inject: {}
	});
	globule.find('./.tmp/*.tmpl')
		.map(function (file) {
			var value = fs.readFileSync(file, 'utf8');
			var key = path.basename(file, '.tmpl');
			var parts = key.split('.');
			if (parts.length > 1) {
				key = parts[0];
				var part = data.inject[key] ? data.inject[key] : {};
				part[parts[1]] = value;
				value = part;
			}

			data.inject[key] = value;
		});
	gulp.src('./src/index.html')
		.pipe(template(data))
		.pipe(prettify())
		.pipe(gulp.dest('./target/dev/'));
});

gulp.task('watch-js', function () {
	watch([globs.js.src, './src/app/.freak/js'], {
		debounceDelay: 1000
	}, function (files, done) {
		seq('clean-jshint', 'dev-jshint', 'dev-js', 'dev-js-template',
			'dev-js-config-run-template',
			'dev-js-bootstrap-template', 'karma',
			'create-phantom-coverage-symlink',
			function (err) {
				done();
			});
	});
});

gulp.task('watch-spec', function () {
	watch(globs.spec.src, function (files, done) {
		seq('karma', 'create-phantom-coverage-symlink', done);
	});
});

gulp.task('watch-bootstrap', function () {
	watch(globs.bootstrap.src, function (files, done) {
		seq('dev-bootstrap', 'dev-js-template', 'dev-js-config-run-template',
			'dev-js-bootstrap-template',
			done);
	});
});

gulp.task('watch-partials', function () {
	watch([globs.templates.app.src, './src/app/.freak/partials'], function (
		files,
		done) {
		seq('dev-partials', 'dev-js-template', done);
	});
});

gulp.task('watch-scss', function () {
	watch(globs.scss.src, function (files, done) {
		seq('dev-scss', 'dev-css-template', done);
	});
});

gulp.task('watch-index-parts', function () {
	watch(['bower.json', 'src/index.html', './.tmp/*.tmpl'], function (files,
		done) {
		seq('dev-include-scripts', 'dev-bower-js-template',
			'dev-bower-css-template', 'assemble-index', done);
	});
});

gulp.task('dev-server', devServer.server({
	root: ['target/dev', 'bower_components', 'test/mock/', '.cache'],
	port: 8887,
	livereload: false
}));

gulp.task('dev-browsersync', function () {
	browserSync({
		host: settings.host,
		port: 3000,
		files: 'target/dev/**',
		proxy: settings.host + ':8887',
		open: false
	});
});

gulp.task('dev-coverage-server', coverageServer.server({
	root: ['target/reports/karma-coverage/lcov-report'],
	host: settings.host,
	port: 8888,
	livereload: false
}));

gulp.task('dev-jasmine-server', jasmineServer.server({
	root: ['target/reports/jasmine'],
	host: settings.host,
	port: 8886,
	livereload: false
}));

gulp.task('dev-coverage-browsersync', function () {
	browserSync({
		host: settings.host,
		port: 3001,
		files: 'target/reports/karma-coverage/lcov-report/**/*',
		proxy: settings.host + ':8888',
		reloadDelay: 2000,
		open: false
	});
});

// Package
gulp.task('dist-templates', function () {
	return gulp.src(paths.templates.app.src)
		.pipe(minifyHtml({
			empty: true,
			quotes: true,
			loose: true
		}))
		.pipe(templateCache(project.angular.bootstrap.module + '.templates.js', {
			module: project.angular.bootstrap.module
		}))
		.pipe(gulp.dest(paths.templates.app.dist));
});

gulp.task('dist-js', function () {
	return gulp.src(globs.js.src)
		.pipe(ngAnnotate(settings.ngAnnotate))
		.pipe(angularFilesort())
		.pipe(uglify(settings.uglify))
		.pipe(concat(project.angular.bootstrap.module + '.js'))
		.pipe(gulp.dest(paths.js.dist));
});

gulp.task('dist-bootstrap', function () {
	return gulp.src(globs.bootstrap.src)
		.pipe(uglify(settings.uglify))
		.pipe(gulp.dest(paths.bootstrap.dist));
});

gulp.task('dist-js-with-bootstrap', function () {
	return gulp.src([globs.js.src, globs.bootstrap.src])
		.pipe(ngAnnotate(settings.ngAnnotate))
		.pipe(angularFilesort())
		.pipe(uglify(settings.uglify))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(paths.js.dist));
});


///////////////////////
///

function includeScripts(type) {
	var templates = {
		'js': '<% Object.keys(includes.fromUrl.js).forEach(function(include){ %><!-- <%= include %> from <%= includes.fromUrl.js[include] %> -->\n<script src="static/<%= includes.fromUrl.js[include].split(\'/\').pop() %>"></script>\n<% }); %>\n',
		'css': '<% Object.keys(includes.fromUrl.css).forEach(function(include){ %><!-- <%= include %> from <%= includes.fromUrl.css[include] %> -->\n<link rel="stylesheet" href="static/<%= includes.fromUrl.css[include].split(\'/\').pop() %>">\n<% }); %>\n'
	};

	if (!templates.js) {
		throw new Error('Couldn\'t find template for type ' + type);
	}

	return file('fromUrl.' + type + '.tmpl',
			templates[type], {
				src: true
			})
		.pipe(template(project))
		.pipe(gulp.dest('./.tmp'));
}

function downloadAssets() {

	var assets = [];

	settings.staticAssetTypes.map(function (type) {
		assets = assets.concat([], Object.keys(bower.project.includes.fromUrl[
				type])
			.map(function (name) {
				var uri = bower.project.includes.fromUrl[type][name];
				uri = uri.indexOf('http') === -1 ? 'https:' + uri : uri;
				return uri;
			}));
	});

	return assets;
}

function fetchedAssets(type) {

	var fetchAssetsByType = [];

	if (settings.staticAssetTypes.indexOf(type) !== -1) {
		fetchAssetsByType = Object.keys(bower.project.includes.fromUrl[type])
			.map(function (name) {
				return bower.project.includes.fromUrl[type][name];
			});
	}

	return fetchAssetsByType;
}

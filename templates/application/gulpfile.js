// Caveat emptor
// =============
//
// This file has been generated, and can be overwritten.
// If you thing something's wrong with this file, please
// visit slush.repositoryUrl and submit a pull
// request, contact the maintainer or file a bug.

var angularFilesort = require('gulp-angular-filesort'),
	concat = require('gulp-concat'),
	csslint = require('gulp-csslint'),
	singleConnect = require('gulp-connect'),
	bowerFiles = require('main-bower-files'),
	browserSync = require('browser-sync'),
	connect = require('gulp-connect-multi'),
	extend = require('extend'),
	fs = require('fs'),
	globule = require('globule'),
	gulp = require('gulp'),
	file = require('gulp-file'),
	inject = require('gulp-inject'),
	jshint = require('gulp-jshint'),
	karma = require('karma')
	.server,
	minifyHtml = require('gulp-minify-html'),
	ngAnnotate = require('gulp-ng-annotate'),
	rename = require('gulp-rename'),
	rimraf = require('rimraf'),
	path = require('path'),
	prettify = require('gulp-jsbeautifier'),
	protractor = require('gulp-protractor')
	.protractor,
	sass = require('gulp-sass'),
	symlink = require('gulp-symlink'),
	seq = require('gulp-sequence')
	.use(gulp),
	tap = require('gulp-tap'),
	template = require('gulp-template'),
	templateCache = require('gulp-angular-templatecache'),
	ucfirst = require('ucfirst'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch');

var settings = {
	uglify: {}
};

var afkl = {},
	appName = '',
	appNameSlug = '',
	devServer = connect(),
	coverageServer = connect(),
	jasmineServer = connect(),
	bower = require('./bower.json');

if (bower && bower.afkl) {
	afkl = bower.afkl;

	if (!afkl.angular) {
		throw new Error('afkl.angular entry in bower.json missing');
	}

	if (!afkl.appName) {
		throw new Error('afkl.appName entry in bower.json missing');
	}
	if (!afkl.appNameSlug) {
		throw new Error('afkl.appNameSlug entry in bower.json missing');
	}
	if (!afkl.angular.bootstrapModule) {
		throw new Error('afkl.angular.bootstrapModule entry in bower.json missing');
	}

	if (!afkl.angular.includes) {
		afkl.angular.includes = {
			fromUrl: {}
		};
	}
}

// Paths
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

// kicks off local coverage and dev servers
// will both open in new browser window

gulp.task('dev', function (done) {
	seq(
		'clean', [
			'dev-bootstrap',
			'dev-js',
			'dev-partials',
			'dev-scss'
		], [
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
});

gulp.task('package', function (done) {
	// clean dist
	// include bootstrap?
	seq('dist-templates', 'dist-js', 'dist-bootstrap', 'dist-js-with-bootstrap',
		done);
});

gulp.task('dev-protractor', ['dev-protractor-server'], function (cb) {
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
});

gulp.task('dev-protractor-server', function () {
	singleConnect.server({
		root: ['target/dev', 'bower_components', 'test/mock/'],
		port: 8885
	});
});

// runs tests and copies reports for usage in bamboo
gulp.task('test', function (done) {
	seq('clean-reports', 'karma', 'create-phantom-coverage-symlink', done);
});

// housekeeping
gulp.task('clean', function (done) {
	rimraf('./target', function () {
		rimraf('./.tmp', function () {
			done();
		});
	});
});

gulp.task('clean-reports', function (done) {
	rimraf('./target/reports', function () {
		done();
	});
});

// Testing

gulp.task('karma', function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js'
	}, function () {
		done();
	});
});

gulp.task('create-phantom-coverage-symlink', function () {
	return gulp.src('*phantom*.info', {
			cwd: 'target'
		})
		.pipe(symlink('target/reports/karma-coverage/sonar/lcov.info'));
});


gulp.task('dev-js', function () {
	return gulp.src(globs.js.src)
		.pipe(ngAnnotate())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulp.dest(paths.js.dev));
});

gulp.task('dev-bootstrap', function () {
	return gulp.src(globs.bootstrap.src)
		.pipe(template(afkl))
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
		.pipe(templateCache(afkl.angular.bootstrapModule + '.templates.js', {
			module: afkl.angular.bootstrapModule
		}))
		.pipe(gulp.dest('./target/dev/app/' + afkl.angular.bootstrapModule));
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

function includeScripts(type) {
	var templates = {
		'js': '<% Object.keys(includes.fromUrl.js).forEach(function(include){ %><!-- <%= include %> -->\n<script src="<%= includes.fromUrl.js[include] %>"></script>\n<% }); %>\n',
		'css': '<% Object.keys(includes.fromUrl.css).forEach(function(include){ %><!-- <%= include %> -->\n<link rel="stylesheet" href="<%= includes.fromUrl.css[include] %>">\n<% }); %>\n'
	};

	if (!templates.js) {
		throw new Error('Couldn\'t find template for type ' + type);
	}

	return file('fromUrl.' + type + '.tmpl',
			templates[type], {
				src: true
			})
		.pipe(template(afkl))
		.pipe(gulp.dest('./.tmp'));
}

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
	var data = extend({}, afkl, {
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
	watch([globs.js.src, './src/app/.freak/js'], function (files, done) {
		seq('dev-js', 'dev-js-template', 'dev-js-config-run-template',
			'dev-js-bootstrap-template', 'karma',
			'create-phantom-coverage-symlink', done);
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
		seq('dev-partials', 'dev-js-template', 'dev-js-config-run-template',
			'dev-js-bootstrap-template', done);
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
		seq('dev-include-scripts', 'assemble-index', done);
	});
});

gulp.task('dev-server', devServer.server({
	root: ['target/dev', 'bower_components', 'test/mock/'],
	port: 8887,
	livereload: false
}));

gulp.task('dev-browsersync', function () {
	browserSync({
		port: 3000,
		files: 'target/dev/**',
		proxy: 'localhost:8887',
		open: false
	});
});

gulp.task('dev-coverage-server', coverageServer.server({
	root: ['target/reports/karma-coverage/phantom/lcov-report'],
	port: 8888,
	livereload: false
}));

gulp.task('dev-jasmine-server', jasmineServer.server({
	root: ['target/reports/jasmine'],
	port: 8886,
	livereload: false
}));

gulp.task('dev-coverage-browsersync', function () {
	browserSync({
		port: 3001,
		files: 'target/reports/karma-coverage/phantom/lcov-report/**/*',
		proxy: 'localhost:8888',
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
		.pipe(templateCache(afkl.angular.bootstrapModule + '.templates.js', {
			module: afkl.angular.bootstrapModule
		}))
		.pipe(gulp.dest(paths.templates.app.dist));
});

gulp.task('dist-js', function () {
	return gulp.src(globs.js.src)
		.pipe(ngAnnotate())
		.pipe(angularFilesort())
		.pipe(uglify(settings.uglify))
		.pipe(concat(afkl.angular.bootstrapModule + '.js'))
		.pipe(gulp.dest(paths.js.dist));
});

gulp.task('dist-bootstrap', function () {
	return gulp.src(globs.bootstrap.src)
		.pipe(uglify(settings.uglify))
		.pipe(gulp.dest(paths.bootstrap.dist));
});

gulp.task('dist-js-with-bootstrap', function () {
	return gulp.src([globs.js.src, globs.bootstrap.src])
		.pipe(ngAnnotate())
		.pipe(angularFilesort())
		.pipe(uglify(settings.uglify))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(paths.js.dist));
});

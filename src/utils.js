var _s = require('underscore.string'),
	_ = require('lodash'),
	fs = require('fs'),
	globule = require('globule'),
	path = require('path'),
	Q = require('q'),

	wrap = require('./q-utils')
	.wrap;

var PROJECTJSON = 'project.json';

var utils = {
	// old shit
	createTree: createTree,
	createTransport: createTransport,
	generateAppName: _generateAppName,
	addApp: addApp,
	addModule: addModule,
	createProjectConfigFile: createProjectConfigFile,
	readConfig: _readConfig,
	generateModuleNames: wrap(_generateModuleNames),
	generateControllerNames: wrap(_generateControllerNames),
	generateProviderNames: wrap(_generateProviderNames),
	generateDirectiveNames: wrap(_generateDirectiveNames),
	// dunno
	createModuleNames: createModuleNames
};

module.exports = utils;

// Old shit

function parse(dir, cb) {
	fs.readdir(dir, function (err, files) {
		if (err) {
			cb(err);
		} else {
			files.map(function (file) {
				fs.stat(path.join(dir, file), function (err, stats) {
					if (err) {
						// throw something nasty
					} else {
						if (stats.isDirectory()) {

							var components = globule.find([dir + file + '/' + file + '.js']);
							if (components.length === 1) {
								console.log('has component: ' + file);
							}
						}
					}
				});

			});
		}
	});
	// read directory, find folders with matching names
	// go into matched directory, etc
	//
	// - or -
	//
	// read directory, find folders with matching names
	//
	// - or -
	// components/{feature}/*feature.module.js
	// tif.feature.js
	// components/{feature}/{feature}.js
	// components/{feature}/{feature}.{other}.js
	// components/{feature}/{feature}.spec.js
	//
}

function handleFiles(dir, files, cb) {
	var file = files.shift();
	if (file) {
		var p = path.join(dir, file);
		fs.stat(p, function (err, stats) {
			if (err)
				cb(err);
			else {
				if (stats.isDirectory())
					parse(p, function (err) {
						if (err)
							cb(err);
						else
							handleFiles(dir, files, cb);
					});
				else if (stats.isFile()) {
					console.log(p);
					handleFiles(dir, files, cb);
				}
			}
		});
	} else {
		cb();
	}

}

function createTree(pattern) {
	var deferred = Q.defer();

	deferred.resolve(globule(pattern));

	return deferred.promise;
}

function createTransport(gulp, more) {
	var transport = {
		args: gulp.args
	};

	return more ? _.extend(transport, more) : transport;
}

function _generateAppName(transport) {
	var application = transport.application;
	var config = transport.config;
	if (!config.applications) {
		config.applications = {};
	}
	if (!application) {
		throw new Error('Missing application reference');
	} else if (!config) {
		throw new Error('Missing config reference');
	} else {
		var cleanedUpName = _s.slugify(application.name)
			.replace(/\-+/g, '.');
		// ooglay
		application.names = _generateModuleNames({
				module: {
					name: application.name
				}
			})
			.module;
		if (!config.applications[cleanedUpName]) {
			config.applications[cleanedUpName] = cleanedUpName;
			return transport;
		} else {
			throw new Error('Application \'' + application.name + '\' already exists');
		}
	}
}

function generateAppName(transport) {
	var application = transport.application;
	var config = transport.config;

	var deferred = Q.defer();

	if (!application) {
		deferred.reject('Missing application reference');
	} else if (!config) {
		deferred.reject('Missing config reference');
	} else {
		var cleanedUpName = _s.slugify(application.name)
			.replace(/\-+/g, '.');
		if (!config.applications || !config.applications[cleanedUpName]) {
			application.name = cleanedUpName;
			deferred.resolve(transport);
		} else if (config.applications && config.applications[cleanedUpName]) {
			deferred.reject('Application \'' + application.name + '\' already exists');
		}
	}

	return deferred.promise;
}

function addApp(transport) {
		var deferred = Q.defer();
		var application = transport.application;
		var config = transport.config;
		if (!config.applications) {
			config.applications = {};
		}
		config.applications[application.name] = {};
		if (transport.dependencies) {
			config.applications[application.name].dependencies = transport.dependencies;
		}
		_writeConfig(config)
			.then(function () {
				deferred.resolve(transport);
			})
			.catch(deferred.reject);
		return deferred.promise;
	}
	// Config file
function createProjectConfigFile(transport) {
	var deferred = Q.defer();

	_readConfig()
		.then(function (existingConfig) {

			transport.config = existingConfig;
			deferred.resolve(transport);
		})
		.catch(function (err) {
			_writeConfig(data)
				.then(function (config) {
					transport.config = config;
					deferred.resolve(transport);
				})
				.catch(function (err) {
					deferred.reject(err);
				})
		});

	return deferred.promise;
}

/**
 * [_writeConfig Writes a new project.json config file if it doesn't exist]
 *
 * @method _writeConfig
 *
 * @param  {[Object]}     data      [Contents of project.json]
 */
function _writeConfig(data) {
	var deferred = Q.defer();
	var outputFilename = process.cwd() + '/' + PROJECTJSON;
	fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function (err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
}


function _readConfig() {
	var deferred = Q.defer();
	try {
		var project = require(path.join(process.cwd(), '/' + PROJECTJSON));
		deferred.resolve(project);
	} catch (err) {
		deferred.reject(err);
	}
	return deferred.promise;
}

function addModule(transport) {
	var createdModule = {};
	var module = transport.module;
	var moduleName = module.name;
	// Split namespace by . in string
	// Create nested folders
	//
	// Write namespaces to project.json
	//
	if (module.existingNamespace) {
		moduleName = module.existingNamespace + '.' + module.name;
	}



	var deferred = Q.defer();
	_readConfig()
		.then(function (config) {
			if (!config.modules) {
				config.modules = [];
			}
			if (config.modules.indexOf(moduleName) === -1) {
				config.modules.push(moduleName);
				config.modules = config.modules.sort();
				_writeConfig(config)
					.then(function () {
						var parts = moduleName.split('.');
						module.name = parts[parts.length - 1];
						deferred.resolve(transport);
					})
					.catch(deferred.reject);

			} else {
				deferred.reject('Module already exists');
			}
		})

	.catch(deferred.reject);

	return deferred.promise;

}

function _generateModuleNames(transport) {
	transport.module = _formatNames(transport.module);

	return transport;
}

function _generateControllerNames(transport) {
	_formatModulePartNames(transport, 'controller', 'Controller');
	return transport;
}

function _generateDirectiveNames(transport) {
	_formatModulePartNames(transport, 'directive', 'Directive');
	return transport;
}

function _generateProviderNames(transport) {
	console.log(transport);
	var partSuffix = 'Service';
	if (transport.provider && transport.provider.partName) {
		var partName = transport.provider.partName;
		if (partName === 'factory') {
			partSuffix = 'Factory';
		}
	}

	_formatModulePartNames(transport, 'provider', partSuffix);
	return transport;
}

function _formatModulePartNames(transport, partName, partSuffix) {
	var part = transport[partName];
	if (!part || !part.name) {
		return;
	} else {
		var rawName = part.name.replace(/\s+/g, ' ')
			.replace(/\.+/g, ' ');


		part.name = _s.slugify(rawName)
			.replace(/\-+/g, '.');
		part.fullName = part.existingNamespace ? part.existingNamespace + '.' +
			part.name : part.name;

		var pathParts = part.fullName.split('.');
		var left = pathParts.shift();
		var right = pathParts.join('.');
		part.paths = left;
		if (right) {
			part.paths = part.fullName.split('.')
				.join('/'); //module.paths + '/' + right;
		} else {
			right = left;
		}

		right = part.fullName;
		// TODO: unfuck this
		/*
		return {
			name: 'foo', // or 'Foo', 'Foo Bar Snafu'
			path: 'foo', // or 'foo/bar', 'foo/bar.snafu'
		}
		*/


		part.slug = _s.slugify(right);
		part.moduleName = right;

		part.capitalizedPartName = _ucfirst(_s.camelize(_s.slugify(part.fullName.split(
				'.')
			.join('-')))) + partSuffix;

		part.capitalizedProviderPartName = part.capitalizedPartName + 'Provider';
		part.capitalizedControllerPartName = part.capitalizedPartName + 'Controller';
		part.fullPartName = transport.module.name + '.' + part.capitalizedPartName +
			partSuffix;
	}
}

function _formatNames(module) {

	if (!module || !module.name) {
		return {};
	} else {

		var prefix = module.prefix ? module.prefix + '.' : '';

		var rawName = module.name.replace(/\s+/g, ' ')
			.replace(/\.+/g, ' ');


		module.name = prefix + _s.slugify(rawName)
		module.expandedName = prefix + _s.slugify(rawName)
			.replace(/\-+/g, '.');
		module.fullName = module.existingNamespace ? module.existingNamespace + '.' +
			module.name : module.name;


		module.slug = _s.slugify(module.fullName);
		module.moduleName = module.name;
		module.pathName = _s.slugify(rawName);
		module.controllerName = _ucfirst(_s.camelize(_s.slugify(module.fullName.split(
				'.')
			.join('-'))));
		return module;
	}
}

function _ucfirst(str) {
	return str.substring(0, 1)
		.toUpperCase() + str.substring(1);
}

function createModuleNames(name) {
	var sluggifiedName = _s.slugify(name);
	var moduleName = _s.camelize(sluggifiedName);
	return {
		name: name,
		slug: sluggifiedName,
		moduleName: _ucfirst(moduleName)
	};
}

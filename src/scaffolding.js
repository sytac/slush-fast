'use strict';

var fs = require('fs'),
	iniparser = require('iniparser'),
	path = require('path'),
	_s = require('underscore.string'),
	wrap = require('./q-utils')
	.wrap;

var scaffolding = {
	findConfig: findConfig,
	getHomeDir: getHomeDir,
	getWorkingDirName: getWorkingDirName,
	getGitUser: getGitUser,
	getGitRepositoryUrl: getGitRepositoryUrl,
	ns: ns,
	findBower: findBower,
	findNpm: findNpm,
	prefixName: _prefixName,
	moduleName: wrap(_moduleName),
	formatModuleName: _formatModuleName,
	controllerName: wrap(_partNameFactory('controller', 'Controller')),
	filterName: wrap(_partNameFactory('filter', 'Filter')),
	providerName: wrap(_partNameFactory('provider', 'Provider')),
	directiveName: wrap(_partNameFactory('directive', 'Directive')),
	serviceName: wrap(_partNameFactory('service', 'Service')),
	factoryName: wrap(_partNameFactory('factory', 'Factory')),
	valueName: wrap(_partNameFactory('value', '')),
	constantName: wrap(_partNameFactory('constant', 'Constant'))
};

module.exports = scaffolding;

function findConfig(configName, dir) {

	var currentDir = path.resolve(dir);
	var pathParts = currentDir.split(path.sep);
	var config;
	var configAbsolute;
	var foundGit;
	while (pathParts.length && !config) {
		configAbsolute = pathParts.join(path.sep) + path.sep + configName;
		if (fs.existsSync(configAbsolute)) {
			config = require(configAbsolute);
		} else if (fs.existsSync(pathParts.join(path.sep) + path.sep + '.git')) {
			foundGit = true;
			console.log('found .git at ', pathParts.join(path.sep));
		}
		pathParts.pop();
	}
	return {
		config: config,
		file: configAbsolute
	};
}

function getHomeDir() {
	return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function getWorkingDirName() {
	return process.cwd()
		.split(path.sep)
		.pop()
		.split('\\')
		.pop();
}

function getGitUser() {
	var gitUser;
	var homeDir = getHomeDir();

	if (homeDir) {
		var configFile = homeDir + '/.gitconfig';


		if (fs.existsSync(configFile)) {
			var config = iniparser.parseSync(configFile);
			if (config && config.user) {
				gitUser = config.user;
			}
		}
	}
	return gitUser;
}

function getGitRepositoryUrl(remoteKey) {
	var repositoryUrl;
	var configFile = './.git/config';
	remoteKey = remoteKey || 'remote "origin"';

	if (fs.existsSync(configFile)) {
		var config = iniparser.parseSync(configFile);
		if (config && config[remoteKey] && config[remoteKey].url) {
			repositoryUrl = config[remoteKey].url;
		}
	}
	return repositoryUrl;
}

function ns(dir, srcAppDir) {
	srcAppDir = srcAppDir || 'src' + path.sep + 'app';
	// replace srcAppDir with local path separator
	srcAppDir = srcAppDir.replace(/\\|\//g, path.sep) || 'src' + path.sep + 'app';
	var currentDir = path.resolve(dir);
	var srcAppDirIndex = currentDir.indexOf(srcAppDir);
	if (srcAppDirIndex !== -1) {

		var left = currentDir.substring(0, srcAppDirIndex + srcAppDir.length);
		var right = currentDir.substring(srcAppDirIndex + srcAppDir.length + 1);
		var possibles = right.split(path.sep);
		var moduleNames = [];


		// Let's see if we can find some modules here

		if (possibles.length) {
			while (possibles.length) {
				// The current path where we will try to find a module
				var currentModuleName = possibles[possibles.length - 1];
				var currentPath = left + path.sep + possibles.join(path.sep);
				var currentModule = currentPath + path.sep + currentModuleName +
					'.module.js';
				if (fs.existsSync(currentModule)) {
					moduleNames.unshift(currentModuleName);
				}
				// let's pop the last part and move on
				possibles.pop();
			}
		}

		return moduleNames;
	} else {
		throw new Error('Couldn\'t find ' + srcAppDir +
			', you\'re not a in a source folder');
	}
}

function findBower(dir) {
	var bowerConfig = 'bower.json';

	var currentDir = path.resolve(dir);
	var pathParts = currentDir.split(path.sep);
	var bower = {};
	while (pathParts.length && !bower.name) {
		var bowerConfigAbsolute = pathParts.join('/') + '/' + bowerConfig;
		if (fs.existsSync(bowerConfigAbsolute)) {
			bower = require(bowerConfigAbsolute);
		}
		pathParts.pop();
	}
	return bower;
}



function findNpm(dir) {
	var npmConfig = 'package.json';

	var currentDir = path.resolve(dir);
	var pathParts = currentDir.split('/');
	var npm = {};
	while (pathParts.length && !npm.name) {
		var npmConfigAbsolute = pathParts.join('/') + '/' + npmConfig;
		if (fs.existsSync(npmConfigAbsolute)) {
			npm = require(npmConfigAbsolute);
		}
		pathParts.pop();
	}
	return npm;
}

function _prefixName(prefix) {
	return _s.trim(prefix.toLowerCase()
			.replace(/[^a-zA-Z0-9]/g, ' ')
			.replace(/\s+/g, ' '))
		.split(' ')
		.join('.');
}

function _moduleName(transport) {

	var module = transport.module;
	if (!module) {
		throw new Error('transport.module missing');
	} else {
		module.prefixWithDot = module.prefix ? module.prefix + '.' : '';
		module.camelCasedPrefix = _s.camelize(module.prefix.split('.')
			.join('-'));

		var ns = module.ns;
		if (!ns) {
			// new root module, expect module.newNs
			if (!module.newNs) {
				throw new Error('transport.module.newNs expected');
			} else {
				module.name = _formatModuleName(module.newNs);

				module.ns = '';
				module.fullNs = module.name;
			}
		} else {
			if (module.newNs) {
				// guess we have a new namespace to create

				module.name = _formatModuleName(module.newNs);
				module.fullNs = module.ns + '.' + module.name;
			} else {
				module.fullNs = module.ns;
				module.name = module.ns.split('.')
					.pop();
			}
		}

		module.prefixedFullNs = module.prefixWithDot + module.fullNs;
		module.camelCasePrefixedFullNs = _s.camelize(module.prefixedFullNs.split('.')
			.join('-'));
		//	console.log('module.prefixedFullNs', module.prefixedFullNs);
		//	console.log('module.camelCasePrefixedFullNs', module.camelCasePrefixedFullNs);
		module.path = 'app/' + module.fullNs.split('.')
			.join(path.sep);

		//	module.name = module.prefix + module.name;
	}

	module.fullNsCamelized = _s.camelize(module.fullNs.split('.')
		.join('-'));
	return transport;
}

function _formatModuleName(name) {
	return _s.dasherize(_s.trim(name)
		.replace(/([A-Z])/g, '-$1')
		.replace(/[-_\s]+/g, '-')
		.toLowerCase());
}

function _partNameFactory(partName, partPostfix) {
	return function (transport) {
		console.log('transport.module', transport.module);
		var part = transport[partName];
		if (!part) {
			throw new Error('Expected transport.' + partName);
		}
		var skipPrefix = false;
		if (part.newName === '.') {
			skipPrefix = true;
			part.newName = transport.module.camelCasePrefixedFullNs;
			part.slug = _s.trim(_s.dasherize(transport.module.fullNs),
				'-');
		} else {
			part.slug = _s.trim(_s.dasherize(part.newName), '-');
		}

		part.partPostfix = partPostfix;
		part.upperCaseCamelizedPartSubName = part.partSubName ? _ucfirst(part.partSubName) :
			part.partSubName = part.partSubName ? part.partSubName : '';

		part.name = _s.camelize(part.newName);
		part.upperCaseCamelized = _ucfirst(part.name);
		part.lowerCaseCamelized = _lcfirst(part.name);
		part.camelizedPartName = part.name + partPostfix;
		part.upperCaseCamelizedPartName = _ucfirst(part.camelizedPartName);
		part.fullNsName = transport.module.camelCasePrefixedFullNs + (skipPrefix ?
			'' : part.upperCaseCamelized);
		part.fullNsNamePartName = transport.module.camelCasePrefixedFullNs + part.upperCaseCamelizedPartName;
		part.fullNsNameSlug = _s.dasherize(part.fullNsName);
		return transport;
	};
}


function _ucfirst(str) {
	return str.substring(0, 1)
		.toUpperCase() + str.substring(1);
}

function _lcfirst(str) {
	return str.substring(0, 1)
		.toLowerCase() + str.substring(1);
}

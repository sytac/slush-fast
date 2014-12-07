var path = require('path'),
	_s = require('underscore.string'),
	wrap = require('./q-utils')
	.wrap;

var scaffolding = {
	ns: ns,
	moduleName: wrap(_moduleName),
	controllerName: wrap(_partNameFactory('controller', 'Controller')),
	providerName: wrap(_partNameFactory('provider', 'Provider')),
	directiveName: wrap(_partNameFactory('directive', 'Directive')),
	serviceName: wrap(_partNameFactory('service', 'Service')),
	factoryName: wrap(_partNameFactory('factory', 'Factory')),
	valueName: wrap(_partNameFactory('value', '')),
	constantName: wrap(_partNameFactory('constant', 'Constant'))
};

module.exports = scaffolding;

function ns(dir) {
	var modulePrefix = '';
	var srcAppDir = 'src' + path.sep + 'app';

	var currentDir = path.resolve(dir);
	var srcAppDirIndex = currentDir.indexOf(srcAppDir);
	if (srcAppDirIndex !== -1) {
		return currentDir.substring(srcAppDirIndex + srcAppDir.length + 1)
			.split('/');
	} else {
		throw new Error('Couldn\'t find src/app, you\'re not a in a source folder');
	}
}

function _moduleName(transport) {

	var module = transport.module;
	if (!module) {
		throw new Error('transport.module missing');
	} else {
		module.prefix = module.prefix ? module.prefix + '.' : '';
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

		module.path = 'app/' + module.fullNs.split('.')
			.join('/');

		//	module.name = module.prefix + module.name;
	}

	module.fullNsCamelized = _s.camelize(module.fullNs.split('.')
		.join('-'));
	return transport;
}

function _formatModuleName(name) {
	return _s.slugify(name.replace(/\s+/g, ' ')
			.replace(/\.+/g, ' '))
		.replace(/\-+/g, '-');
}

function _partNameFactory(partName, partPostfix) {
	return function (transport) {
		var part = transport[partName];
		if (!part) {
			throw new Error('Expected transport.' + partName);
		}

		part.slug = _s.slugify(part.newName);
		part.partPostfix = partPostfix;
		part.upperCaseCamelizedPartSubName = part.partSubName ? _ucfirst(part.partSubName) :
			part.partSubName = part.partSubName ? part.partSubName : '';
		'';
		part.name = _s.camelize(part.slug);
		part.upperCaseCamelized = _ucfirst(part.name);
		part.camelizedPartName = part.name + partPostfix;
		part.upperCaseCamelizedPartName = _ucfirst(part.camelizedPartName);
		part.fullNsName = transport.module.fullNsCamelized + _ucfirst(part.name);
		return transport;
	}
}


function _ucfirst(str) {
	return str.substring(0, 1)
		.toUpperCase() + str.substring(1);
}

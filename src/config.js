'use strict';

var _ = require('lodash'),
	_s = require('underscore.string'),
	extend = require('extend'),
	fs = require('fs'),
	inquirer = require('inquirer'),
	Q = require('q'),
	gutil = require('gulp-util'),
	scaffolding = require('./scaffolding');

var configuration = {
	prompts: {
		chooseGeneratorType: chooseGeneratorType
	}
};
module.exports = configuration;

function chooseGeneratorType(defaults) {

	return _start(defaults)
		.then(_moduleType)
		.then(_usePackageManager)
		.then(_userDetails)
		.then(_moduleName)
		.then(_install)
		.then(_finish)
		.then(_writeOut);
}


function _start(defaults) {
	var deferred = Q.defer();

	// generator some reasonable defaults here
	// project name
	// git user etc
	var workingDirName = scaffolding.getWorkingDirName();
	var generatorConfig = defaults.configs.generator;
	var isNew = false;

	if (!generatorConfig || defaults.isNew) {
		isNew = defaults.isNew = true;
	}

	var _answers = {};
	var generatorTypes = ['scaffolding-only', 'spa', 'module'];
	var moduleTypes = ['directive', 'filter', 'service', 'factory', 'provider',
		'module-only'
	];
	var prompts = [{
		name: 'type',
		message: 'What kind of project would you like to create?',
		type: 'list',
		choices: generatorTypes,
		default: _answers.type ? _answers.type : generatorTypes[0],
		when: function (answers) {
			// let's hijack answers
			_answers = answers;

			if (!generatorConfig || !generatorConfig.type) {
				return true;
			}
		}
	}, {
		name: '_name',
		message: 'What is the name of your project?',
		validate: function (value) {
			return !value ? 'Please provide a name' : true;
		},
		default: function () {
			return _answers.name ? _answers.name.full : workingDirName;
		},
		when: function () {
			return !generatorConfig || !generatorConfig.name || !generatorConfig.name
				.full;
		},
		filter: function (value) {
			_answers.name = {
				full: _s.trim(value),
				slug: _s.trim(_s.dasherize(value), '-')
			};
			return _answers.name.full;
		}
	}, {
		name: 'description',
		message: 'What is the description?',
		validate: function (value) {
			return !value ? 'Please provide a description' :
				true;
		},
		default: _answers.description ? _answers.description : '',
		when: function () {
			return !generatorConfig || !generatorConfig.description;
		}
	}, {
		name: 'prefix',
		message: 'What is the prefix of your project? (for example: tif., ltc. or prds.)',
		default: _answers.prefix ? _answers.prefix : 'afkl',
		validate: function (value) {
			return !value ? 'Please provide a prefix' : true;
		},
		filter: scaffolding.prefixName,
		when: function () {
			return !generatorConfig || !generatorConfig.prefix;
		}
	}, {
		name: 'moduleType',
		message: 'What kind of module would you like to create?',
		type: 'list',
		choices: moduleTypes,
		when: function (answers) {
			return answers.type === 'module';
		}
	}];
	inquirer.prompt(prompts, function (answers) {
		answers = _cleanAnswers(answers);

		defaults.configs.generator = extend({}, generatorConfig, answers);
		// add some defaults for npm and bower
		if (isNew) {
			if (['spa', 'module'].indexOf(defaults.configs.generator.type) !== -1) {
				defaults.configs.meta = extend({}, defaults.configs.meta, {
					useNpm: true,
					useBower: true,
					usePackageManager: true
				});
			} else if (['scaffolding-only'].indexOf(defaults.configs.generator.type) !==
				-1) {
				defaults.configs.meta = extend({}, defaults.configs.meta, {
					usePackageManager: false
				});
			}
		}

		deferred.resolve(defaults);
	});

	return deferred.promise;
}

function _moduleType(defaults) {
	var deferred = Q.defer();
	var _answers = {};

	var srcDirs = {
		'spa': 'src/app',
		'scaffolding-only': 'src',
		'module': 'src'
	};

	var defaultGeneratorOptions = {
		'spa': {
			server: {
				rewrites: {
					defaults: {
						host: 'www.klm.com'
					},
					templates: [
						'^/ams/(.*)$ https://<%=host%>/ams/$1 [P]',
						'^/nls/(.*)$ https://<%=host%>/nls/$1 [P]'
					]
				}
			}
		}
	};

	var generatorConfig = defaults.configs.generator;

	var srcDir = srcDirs[generatorConfig.type];
	if (srcDir) {
		generatorConfig.srcDir = srcDir;
	} else {
		deferred.reject('No src dir config found for generator type: ' +
			generatorConfig.type);
	}


	var moduleTypesPrompts = {
		'spa': [{
			name: '_bootstrap',
			message: function (answers) {
				_answers = answers;
				return 'What is the bootstrap module of your project? (for example: ' +
					generatorConfig.prefix + '.example, ' + generatorConfig.prefix +
					'.toolbar). The \'' + generatorConfig.prefix +
					'\' prefix will be added automatically.';
			},
			default: 'your-module',
			validate: function (value) {
				return value ? true : 'Please provide a bootstrap module name';
			},
			filter: function (_bootstrap) {
				var cleanBootstrapModuleName = scaffolding.formatModuleName(_bootstrap);
				var nsModuleName = generatorConfig.prefix + '.' +
					cleanBootstrapModuleName;
				generatorConfig.bootstrap = extend({}, generatorConfig.bootstrap, {
					module: nsModuleName,
					element: _s.slugify(nsModuleName.split('.')
						.join('-'))
				});

				// Piggy back on defaults
				_.extend(defaults, {
					module: {
						prefix: scaffolding.prefixName(generatorConfig.prefix),
						ns: '',
						newNs: cleanBootstrapModuleName
					}
				});
				return nsModuleName;
			},
			when: function () {
				return !generatorConfig.bootstrap;
			}
		}, {
			name: 'bowerAddFreakDeps',
			message: function () {
				return 'Would you like to add Freak Angular Dependencies? ' +
					'Type Y for static domain, type N for Angular from bower repository';
			},
			type: 'confirm',
			default: true
		}],
		'scaffolding-only': [{
			name: 'srcDir',
			message: 'Choose src directory',
			default: generatorConfig.srcDir
		}],
		'module': []
	};


	var prompts = moduleTypesPrompts[generatorConfig.type];

	if (defaultGeneratorOptions[generatorConfig.type]) {
		defaults.configs.generator = extend({}, defaults.configs.generator,
			defaultGeneratorOptions[generatorConfig.type]);
	}
	if (prompts && prompts.length) {
		inquirer.prompt(prompts, function (answers) {
			answers = _cleanAnswers(answers);
			defaults.configs.generator = extend({}, generatorConfig,
				answers);
			deferred.resolve(defaults);
		});
	} else if (!prompts.length) {
		defaults.configs.generator = extend({}, generatorConfig);
		deferred.resolve(defaults);
	} else {
		deferred.reject('No prompts found for module type ' + generatorConfig.type);
	}

	return deferred.promise;
}

function _userDetails(defaults) {
	var deferred = Q.defer();
	if (defaults.configs.meta && defaults.configs.meta.usePackageManager) {
		// do the git dance
		var repositoryUrl = scaffolding.getGitRepositoryUrl();
		var gitUser = scaffolding.getGitUser() || {};
		var prompts = [{
			name: 'authorName',
			message: 'What is the author name?',
			default: gitUser.name ? gitUser.name : ''
		}, {
			name: 'authorEmail',
			message: 'What is the author email?',
			default: gitUser.email ? gitUser.email : ''
		}, {
			name: 'userName',
			message: 'What is the github username?',
			default: gitUser.name ? gitUser.name.toLowerCase()
				.replace(/\s/g, '') : ''
		}, {
			name: 'repositoryUrl',
			message: 'Repository URL',
			default: repositoryUrl
		}];

		inquirer.prompt(prompts, function (answers) {
			answers = _cleanAnswers(answers);
			defaults.configs.meta = extend({}, defaults.configs.meta,
				answers);
			deferred.resolve(defaults);
		});


	} else {
		deferred.resolve(defaults);
	}

	return deferred.promise;
}

function _moduleName(defaults) {
	if (defaults.module) {
		return scaffolding.moduleName(defaults);
	} else {
		var deferred = Q.defer();
		// yeah I know
		deferred.resolve(defaults);
		return deferred.promise;
	}
}


function _usePackageManager(defaults) {
	var deferred = Q.defer();
	if (defaults.isNew && (defaults.meta && defaults.meta.usePackageManager !==
			false)) {
		var meta = defaults.configs.meta || {};
		var prompts = [];
		if (!meta.useBower) {
			prompts.push({
				name: 'useBower',
				type: 'confirm',
				message: 'Use bower for package management?'
			});
		}
		if (!meta.useNpm) {
			prompts.push({
				name: 'useNpm',
				type: 'confirm',
				message: 'Use npm for package management?'
			});
		}
		if (!prompts.length) {
			deferred.resolve(defaults);
		} else {

			inquirer.prompt(prompts, function (answers) {
				Object.keys(answers)
					.map(function (key) {
						if (answers[key]) {
							answers.usePackageManager = true;
						}
					});
				defaults.configs.meta = extend({}, defaults.configs.meta,
					answers);
				deferred.resolve(defaults);
			});
		}
	} else {
		deferred.resolve(defaults);
	}
	return deferred.promise;
}

function _install(defaults) {
	var deferred = Q.defer();
	if (defaults.configs.meta && defaults.configs.meta.useNpm) {
		inquirer.prompt([{
			name: 'installNpm',
			type: 'confirm',
			message: 'Install npm dependencies now?'
		}], function (answers) {
			defaults.configs.meta = extend({}, defaults.configs.meta,
				answers);

			deferred.resolve(defaults);
		});
	} else {
		deferred.resolve(defaults);
	}
	return deferred.promise;
}

function _finish(defaults) {
	var deferred = Q.defer();

	var prompts = [{
		type: 'confirm',
		name: '_proceed',
		message: function () {
			return 'Continue?';
		}
	}];

	var generatorOverviewTemplate = fs.readFileSync(defaults.paths.templates +
		'/generator/generatorOverview.html', 'utf8');
	var rendered = _.template(generatorOverviewTemplate)(defaults.configs);

	rendered
		.split('\n')
		.map(function (line) {
			gutil.log(line);
		});

	if (!defaults.isNew) {
		deferred.resolve(defaults);
	} else {
		inquirer.prompt(prompts, function (answers) {
			if (!answers._proceed) {
				deferred.reject('Aborted');
			} else {
				answers = _cleanAnswers(answers);
				defaults.configs.generator = extend({}, defaults.configs.generator,
					answers);
				deferred.resolve(defaults);
			}
		});
	}

	return deferred.promise;
}


function _writeOut(defaults) {
	var deferred = Q.defer();

	var serialized = '';
	try {
		serialized = JSON.stringify(defaults.configs.generator, null, 4) + '\n';
	} catch (err) {
		deferred.reject(err);
	}

	fs.writeFile('./generator.json', serialized, function (err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(defaults);
		}
	});
	return deferred.promise;
}


function _cleanAnswers(answers) {
	var cleanAnswers = {};

	Object.keys(answers)
		.map(function (key) {
			if (key.indexOf('_') !== 0) {
				cleanAnswers[key] = answers[key];
			}
		});

	return cleanAnswers;
}

// do we have a config file?
// what kind of configuration do we have?
// 	- just scaffolding
// 	- spa
// 	- directive
// 	- service/factory/provider/filter maybe even controller

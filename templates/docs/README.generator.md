# Slush Freak Angular Scaffolding Tools

<%= readme.common.generated %>
<%= readme.generator.features %>
<%= readme.prerequisites %>
<%= readme.generator.installation %>
<%= readme.generator.usage %>

### Running in CI mode

```
gulp serve
```

In CI mode four local servers will be spawned:
- [http://localhost:3001](http://localhost:3001) Development server with [BrowserSync](http://www.browsersync.io/)
- [http://localhost:8887](http://localhost:8887) Development server
- [http://localhost:8888](http://localhost:8888) Karma coverage report
- [http://localhost:8886](http://localhost:8886) Jasmine report


### Packaging for production

```
gulp package
```

Packaging provides the following:

- Per module
- All modules
- Bootstrap script
- All modules with bootstrap scripts

### Per module

## Modules

### Create a module

#### Top level namespace modules

Make sure you are in the project's `src/app` directory.

```
$ slush fast:module {optional name}
```

This will create a module in `src/app/{name}` called `{name}.module.js`. If module name is not given as a command line parameter you will be prompted for one.
The namespace for this module is the prefix concatenated with name: {prefix}.{name}

For example, for a given prefix 'afkl', calling

```
$ slush fast:module foo
```

will create a directory `foo` containing a file `foo.module.js`. The module definition will look like this:
```
angular.module('afkl.foo', []);
```


#### Sub modules

Inside a module directory `{module}` where a files exists named '{module}.module.js' you can create sub modules easily like so:

```
$ slush fast:module {optional name}
```


Again, the name is optional, you will be prompted for one if it is not given as a parameter. File naming behaviour is the same as creating a top level module, namespacing behaviour differs.

For example, calling the following inside `src/app/foo`

```
$ slush fast:module bar
```

will create a directory `src/app/foo/bar` containing a file `bar.module.js` and a file `bar.module.spec.js`.
So far, so good, nothing fancy here. However, the namespace for this module is inherited from the parent module:

```
angular.module('afkl.foo.bar', []);
```

This way you can easily scale features while mainting unique namespaces to prevent collisions.


### Module parts

#### Config

Inside the current module directory you can run the following command:

```
$ slush fast:config
```

This will create a new file with the same name as the module postfixed with `.config` along with a unit test spec file postfixed with '.config.spec';

For example, calling this following inside `src/app/foo`

```
$ slush fast:config
```

will create a file `src/app/foo/foo.config.js` containing a definition like this:

```
angular.module('afkl.foo')
  .config( .... )
```

and a file `src/app/foo/foo.config.spec.js`.


#### Run

Inside the current module directory you can run the following command:

```
$ slush fast:run
```

This will create a new file with the same name as the module postfixed with `.run`;

For example, calling this following inside `src/app/foo`

```
$ slush fast:run
```

will create a file `src/app/foo/foo.run.js` containing a definition like this:

```
angular.module('afkl.foo')
  .run( .... )
```

#### Controller

Inside the current module directory you can run the following command:

```
$ slush fast:controller {optional name}
```

If you don't provide a name, you will be prompted for one.
This will create a new file with the same name as the module postfixed with `.controller`, as well as a controller spec file.

For example, calling this following inside `src/app/foo`

```
$ slush fast:controller barbar
```

will create a file `src/app/foo/barbar.controller.js` containing a definition like this:

```
angular.module('afkl.foo')
  .controller('BarBar',  .... )
```


#### Directive

Inside the current module directory you can run the following command:

```
$ slush fast:directive {optional name}
```

If you don't provide a name, you will be prompted for one.
This will create a new file with the same name as the module postfixed with `.directive`, as well as a
directive `.html` file and directive spec file.

For example, calling this following inside `src/app/foo`

```
$ slush fast:directive blinken lights
```

This will create the following files: `blinken-lights.directive.js`, `blinken-lights.directive.html` and `foo.blinken-lights.directive.spec.js`
The `src/app/foo/blinken-lights.directive.js` file contains the following definition:

```
angular.module('afkl.foo')
  .directive('afklFooBlinkenLights',  .... )
```


#### Provider

Inside the current module directory you can run the following command:

```
$ slush fast:provider {optional name}
```

If you don't provide a name, you will be prompted for one. You will also be prompted for one of the provider types: `service` or `factory`.
This will create a new file with the same name as the module postfixed with `.provider`, as well as a  provider spec file.

For example, calling this following inside `src/app/foo`

```
$ slush fast:provider unf
```

This will prompt for `service` or `factory` and create the following files: `unf.provider.js`, `tests/unf.provider.spec.js` and either `unf.service.spec.js` or `unf.factory.spec.js`.

The `src/app/foo/unf.provider.js` file contains the following definition:

```
angular.module('afkl.foo')
        .provider('afklFooUnf', .... )
```
#### Value

Inside the current module directory you can run the following command:

```
$ slush fast:value {optional name}
```


#### Constant

Inside the current module directory you can run the following command:

```
$ slush fast:constant {optional name}
```


#### Service

Inside the current module directory you can run the following command:

```
$ slush fast:service {optional name}
```

#### Factory

Inside the current module directory you can run the following command:

```
$ slush fast:factory {optional name}
```

# Slush Freak Angular Tools

Angular >1.2 scaffolding tools built on top of [slush](http://slushjs.github.io/), which is [gulp](http://gulpjs.com/) based streaming scaffolding system.

# Features

- Modelled on John Papa's styleguide
- Scaffolding of angular modules, including all moving parts like
- Ability to include statically served assets
- Continuous integration server with reports like code coverage, jshint and csshint
- Packaging for deployment, including source maps

## Install prerequisites

- [git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [node and npm, its package manager](http://nodejs.org/)


Install the development tools you need for scaffolding, bear in mind these tools need to be installed globally, for *nixy systems you might want to use `sudo` or take a [look here](http://howtonode.org/introduction-to-npm) for npm without sudo.


```
$ npm install -g slush
$ npm install -g git+https://github.com/jpwesselink/slush-freak.git

```

## Usage

### Initialize a new project

```
mkdir yourproject
cd yourproject
git init
slush freak
```

You will be prompted for input on project name, angular application module for bootstrapping, user name, etc. Upon finishing the generator will create a project layout for you.

### Running in CI mode

In CI mode two local servers will be spawned:
- [http://localhost:8887](http://localhost:8887) Development server
- [http://localhost:8888](http://localhost:8888) Karma coverage report


```
gulp dev
```


## Modules

### Create a module

#### Top level namespace modules

Make sure you are in the project's `src/app` directory.

```
$ slush freak:module {optional name}
```

This will create a module in `src/app/{name}` called `{name}.module.js`. If module name is not given as a command line parameter you will be prompted for one.
The namespace for this module is the same as the name: {name}

For example, calling

```
$ slush freak:module foo
```

will create a directory `foo` containing a file `foo.module.js`. The module definition will look like this:
```
angular.module('foo', []);
```


#### Sub modules

Inside a module directory `{module}` where a files exists named '{module}.module.js' you can create sub modules easily like so:

```
$ slush freak:module {optional name}
```


Again, the name is optional, you will be prompted for one if it is not given as a parameter. File naming behaviour is the same as creating a top level module, namespacing behaviour differs.

For example, calling the following inside `src/app/foo`

```
$ slush freak:module bar
```

will create a directory `src/app/foo/bar` containing a file `bar.module.js` and a file `bar.module.spec.js`.
So far, so good, nothing fancy here. However, the namespace for this module is inherited from the parent module:

```
angular.module('foo.bar', []);
```

This way you can easily scale features while mainting unique namespaces to prevent collisions.


### Module parts

#### Config

Inside the current module directory you can run the following command:

```
$ slush freak:config
```

This will create a new file with the same name as the module postfixed with `.config` along with a unit test spec file postfixed with '.config.spec';

For example, calling this following inside `src/app/foo`

```
$ slush freak:config
```

will create a file `src/app/foo/foo.config.js` containing a definition like this:

```
angular.module('foo')
  .config( .... )
```

and a file `src/app/foo/foo.config.spec.js`.


#### Run

Inside the current module directory you can run the following command:

```
$ slush freak:run
```

This will create a new file with the same name as the module postfixed with `.run`;

For example, calling this following inside `src/app/foo`

```
$ slush freak:run
```

will create a file `src/app/foo/foo.run.js` containing a definition like this:

```
angular.module('foo')
  .run( .... )
```

#### Controller

Inside the current module directory you can run the following command:

```
$ slush freak:controller {optional name}
```

If you don't provide a name, you will be prompted for one.
This will create a new file with the same name as the module postfixed with `.controller`, as well as a controller spec file.

For example, calling this following inside `src/app/foo`

```
$ slush freak:controller barbar
```

will create a file `src/app/foo/foo.barbar.controller.js` containing a definition like this:

```
angular.module('foo')
  .controller('BarBar',  .... )
```


#### Directive

Inside the current module directory you can run the following command:

```
$ slush freak:directive {optional name}
```

If you don't provide a name, you will be prompted for one.
This will create a new file with the same name as the module postfixed with `.directive`, as well as a
directive `.html` file and directive spec file.

For example, calling this following inside `src/app/foo`

```
$ slush freak:directive blinken lights
```

This will create the following files: `foo.blinken-lights.directive.js`, `foo.blinken-lights.directive.html` and `foo.blinken-lights.directive.spec.js`
The `src/app/foo/foo.blinken-lights.directive.js` file contains the following definition:

```
angular.module('foo')
  .directive('blinkenLights',  .... )
```


#### Provider

Inside the current module directory you can run the following command:

```
$ slush freak:provider {optional name}
```

If you don't provide a name, you will be prompted for one. You will also be prompted for one of the provider types: `service` or `factory`.
This will create a new file with the same name as the module postfixed with `.provider`, as well as a  provider spec file.

For example, calling this following inside `src/app/foo`

```
$ slush freak:provider unf
```

This will create the following files: `foo.unf.provider.js` and `foo.unf.provider.spec.js`
The `src/app/foo/foo.unf.provider.js` file contains the following definition:

```
angular.module('foo')
        .provider('UnfProvider', .... )
```
#### Value

Inside the current module directory you can run the following command:

```
$ slush freak:value {optional name}
```
#### Constant

Inside the current module directory you can run the following command:

```
$ slush freak:constant {optional name}
```
#### Service

Inside the current module directory you can run the following command:

```
$ slush freak:service {optional name}
```
#### Factory

Inside the current module directory you can run the following command:

```
$ slush freak:factory {optional name}
```

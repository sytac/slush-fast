## Installation

Install the development tools you need for scaffolding, bear in mind these tools need to be installed globally, for *nixy systems you might want to use `sudo` or take a [look here](http://howtonode.org/introduction-to-npm) for npm without sudo.

```
$ npm install -g slush gulp bower

```

### Installation of the slush generators

#### With private npm registry

```
$ npm install -g slush-fast
```

#### Without private npm registry
```
$ npm install -g git+<%= slush.npm.repository.url %>
```

Scaffolding rationale
=====================

- Create a module
- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/)
- [Gulp.js](http://gulpjs.com/)
- [Slush](http://slushjs.github.io/)

Appendices
==========

bower.json addendum
-------------------
```
"project": {
	"name" : {
		"long": "Application name",
		"slug": "application-name",
	}
	"angular": {
```

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"project": {
    ...
    "angular": {
        "bootstrap": {
					"module": "bootstrap-module",
					"element": "bootstrap-module-app"
				}
    },
    "includes": {
        "fromUrl": {
            "js": {
                "identifier": "http://foo.bar.com/foo.js",
        "identifier-2": "http://foo.bar.com/foo-2.js"
            },
            "css": {
                "identifier": "http://foo.bar.com/styles.css",
                "identifier-2": "http://foo.bar.com/styles-too.css"
            }
        }
    }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

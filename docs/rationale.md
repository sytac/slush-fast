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
"afkl": {
	"appName": "Application name",
	"appNameSlug": "application-name",
	"angular": {
```

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"afkl": {
    "appName": "Application name",
    "appNameSlug": "application-name",
    "angular": {
        "bootstrapModule": "bootstrap-module"
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

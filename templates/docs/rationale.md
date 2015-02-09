Scaffolding rationale
=====================

Appendices
==========

generator.json addendum
-------------------
```
"project": {
	"type" : "{scaffolding-only|spa|directive|module}",
	"name" : {
		"long": "Application name",
		"slug": "application-name",
	},
	"root" : "/src/app",
	"angular" : {
		"prefix" : "afkl"
	}
```

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"project": {
    ...
    "angular": {
        "bootstrap": {
					"module": "bootstrap-module",
					"element": "bootstrap-module-app"
				}
    }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

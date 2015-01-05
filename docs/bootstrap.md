## Bootstrap

Since this is a angular application, it needs a bootstrap module to kick off. You can find the reference to
this module in the `bower.json` file:

<%= afkl.angular.bootstrapModule %>

```
"afkl": {
  ...
  "angular": {
    "prefix": "afkl.tif",
    "**bootstrapModule**": "**afkl.tif.toolbar**",
    "bootstrapElement": "afkl-tif-toolbar-app"
  }
}
```

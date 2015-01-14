## Bootstrap

Since this is a angular application, it needs a bootstrap module to kick off. You can find the reference to
this module in the `bower.json` file:

<%= project.angular.bootstrap.module %>

```
"project": {
  ...
  "angular": {
    "prefix": "afkl.tif",
    "bootstrap" : {
      "module" : "afkl.tif.toolbar",
      "element" : "afkl-tif-toolbar-app"
    }
  }
}
```

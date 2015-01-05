## Command line options

For now the following options are available given that you use gulp directly. This will require you to have gulp installed.

Use `gulp dev` in lieu of `npm run dev`

- `--host` - Sets the host domain for local servers. Defaults to `localhost`. 
```
gulp dev --host=local.klm.com
```

- `--skip-downloads` - Keeps `.cache` directory and skips downloads of static assets. Defaults to `false`.
```
gulp dev --skip-downloads
```

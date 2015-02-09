## Command line defaults

For now the following defaults are available given that you use gulp directly. This will require you to have gulp installed.

Use `gulp dev` in lieu of `npm run dev`

- `--host` - Sets the host domain for local servers. Defaults to `localhost`.
```
gulp dev --host=local.klm.com
```

- `--rewrite-host` - By default all requests to `/ams` and `/nls` are rewritten to `https://www.klm.com`. You can override this behaviour by setting the host manually. Defaults to `www.klm.com`.
```
gulp dev --rewrite-host=www.ite1.klm.com
```

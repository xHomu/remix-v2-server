An sample repo for setting up the new Remix v2 dev server, which offers better development experience and HMR/HDR support.

---

Depending on whether you're using native esm/cjs server and server.js/ts, the following files needs to be adjusted:

* package.json
* remix.config.js
* tsconfig.json
* server.ts or server.js

Check the branches to see how they differ:

* [CommonJS + server.js](https://github.com/xHomu/remix-v2-server/compare/main...cjs-server.js)
* [CommonJS + server.ts](https://github.com/xHomu/remix-v2-server/compare/main...cjs-server.ts)
* [ES Modules + server.js](https://github.com/xHomu/remix-v2-server/compare/main...esm-server.js)
* [ES Modules  + server.ts](https://github.com/xHomu/remix-v2-server) (you are here)

For more on Remix v2 dev server, check these talks by Pedro Cattori @pcattori

* [Next gen HMR in Remix](https://www.youtube.com/watch?v=79M4vYZi-po)
* [EpicWeb.dev Live stream: Upgrading to Remix 1.16.0](https://www.youtube.com/watch?v=IjE18rXpp9Q)


## Troubleshooting

### Syntax Error causes dev server to crash

* Reference https://github.com/remix-run/remix/pull/6467 

This is fixed in v1.17.0+.

### `tsx watch` fails to start on Windows

* Reference https://github.com/remix-run/remix/pull/6538

Due to upstream `tsx watch` bug, we would use `ts-node` instead. 

If you do need to use tsx watch, you can apply the following patch with `patch-package` to `node_modules\@remix-run\dev\dist\devServer_unstable\index.js` to fix the issue.


```js
    let newAppServer = execa.command(command, {
-     stdio: "pipe",
+     stdio: ['ignore', 'inherit', 'inherit'],
+     shell: true,
      env: {
        NODE_ENV: "development",
        PATH:
          bin + (process.platform === "win32" ? ";" : ":") + process.env.PATH,
        REMIX_DEV_HTTP_ORIGIN: stringifyOrigin(httpOrigin),
      },
      // https://github.com/sindresorhus/execa/issues/433
      windowsHide: false,
    });
```

 Alternatively, you can temporarily remove the tsx watch flag, `"dev:server": "tsx ./server.ts",`. However, changes made to `server.ts` will not show up until you manually restart the server.

----

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

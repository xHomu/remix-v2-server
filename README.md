An sample repo for setting up the new Remix v2 dev server, which offers better development experience and HMR/HDR support.

---

Depending on whether you're using native esm/cjs server and server.js/ts, the following files needs to be adjusted:

* package.json
* remix.config.js
* tsconfig.json
* server.ts or server.js

## [Check the branches for examples to your specific setup](https://github.com/xHomu/remix-v2-server/branches) 

How they differ:

* [CommonJS + server.js](https://github.com/xHomu/remix-v2-server/commit/f73c6f3e2dc6f8cc60c80ecda97be68eda163e64)
* [CommonJS + server.ts](https://github.com/xHomu/remix-v2-server/commit/ab19dd14c524fbc7eb8b1968bb9a2d9fe5e037f7)
* [ES Modules + server.js](https://github.com/xHomu/remix-v2-server/commit/8119a735e73b0716cbaeab53dac5adf58d14278e)
* [ES Modules  + server.ts](https://github.com/xHomu/remix-v2-server/commit/d4993e73f5d6a28291bf120364f93210eddbb516)

For more on Remix v2 dev server, check these talks by @pcattori Pedro Cattori!

* [Remix v2 Dev Server Docs](https://remix.run/docs/en/main/other-api/dev-v2)
* [Next gen HMR in Remix](https://www.youtube.com/watch?v=79M4vYZi-po)
* [EpicWeb.dev Live stream: Upgrading to Remix 1.16.0](https://www.youtube.com/watch?v=IjE18rXpp9Q)


## Troubleshooting

### Syntax Error causes dev server to crash

* Reference https://github.com/remix-run/remix/pull/6467 

This is fixed in v1.17.0+.

### `tsx watch` fails to start on Windows

* Reference https://github.com/remix-run/remix/pull/6538

Due to upstream `tsx watch` bug, we would use `ts-node` with `nodemon --watch` instead. 

If you do need to use tsx watch, you will need to patch `node_modules\@remix-run\dev\dist\devServer_unstable\index.js` with something like `patch-package` to fix the issue:


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

 Alternatively, you can do without the watch flag, `"dev:server": "tsx ./server.ts",`. However, changes made to `server.ts` will not show until you manually reboot the server.

* See also: [tsx workaround on Epic Stack](https://github.com/epicweb-dev/epic-stack/blob/main/server/dev-server.js)


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

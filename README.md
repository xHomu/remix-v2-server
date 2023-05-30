An sample repo to show how to setup the new Remix dev server for better development experience and HMR/HDR support.

For more on Remix v2 dev server, check the talks from Pedro Cattori @pcattori

* [Next gen HMR in Remix](https://www.youtube.com/watch?v=79M4vYZi-po)
* [EpicWeb.dev Live stream: Upgrading to Remix 1.16.0](https://www.youtube.com/watch?v=IjE18rXpp9Q)

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
* [ES Modules  + server.ts](https://github.com/xHomu/remix-v2-server/main) (you are here)


## Troubleshooting

There are two bugs with Remix v1.16.1 you have to watch out for:

* Syntax Error causing dev server to crash: https://github.com/remix-run/remix/pull/6467 The fix is introduced to the nightly build.
* `tsx watch` does not start the dev server on Windows: https://github.com/remix-run/remix/issues/6504

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

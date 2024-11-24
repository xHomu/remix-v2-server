Use the following commands to quickly start a Remix v2 app with a basic Express server:

- [CommonJS + server.js](https://github.com/xHomu/remix-v2-server/tree/cjs-server.js): `npx create-remix --template https://github.com/xHomu/remix-v2-server/tree/cjs-server.js`
- [CommonJS + server.ts](https://github.com/xHomu/remix-v2-server/tree/cjs-server.ts): `npx create-remix --template https://github.com/xHomu/remix-v2-server/tree/cjs-server.ts`
- [ES Modules + server.js](https://github.com/xHomu/remix-v2-server/tree/esm-server.js): `npx create-remix --template https://github.com/xHomu/remix-v2-server/tree/esm-server.js`
- [ES Modules + server.ts](https://github.com/xHomu/remix-v2-server/tree/cjs-server.ts): `npx create-remix --template https://github.com/xHomu/remix-v2-server/tree/esm-server.ts`

---

If updating from a v1 Remix app, the following files probably needs to be adjusted:

- package.json
- remix.config.js
- tsconfig.json
- server.ts or server.js

What changes will depend on whether your repo is ESM/CJS, and whether you're using a typescript or javascript server:

- [CommonJS + server.js](https://github.com/xHomu/remix-v2-server/compare/afb226b3e55f3f0d7f6dce0af0252df57fda186f..cjs-server.js)
- [CommonJS + server.ts](https://github.com/xHomu/remix-v2-server/compare/f775b2caf405834176cbd76c400f74f45a88e99b..cjs-server.ts)
- [ES Modules + server.js](https://github.com/xHomu/remix-v2-server/compare/8119a735e73b0716cbaeab53dac5adf58d14278e..esm-server.js)
- [ES Modules + server.ts](https://github.com/xHomu/remix-v2-server/compare/8fd862f9d23ea308d7359e0917e6aa1e4a1ef691..esm-server.ts)

For more on Remix v2 dev server, check these talks by @pcattori Pedro Cattori!

- [Remix v2 Dev Server Docs](https://remix.run/docs/en/main/other-api/dev-v2)
- [Migrating your project to v2_dev](https://www.youtube.com/watch?v=6jTL8GGbIuc)
- [Next gen HMR in Remix](https://www.youtube.com/watch?v=79M4vYZi-po)

---

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

- `server.js`
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

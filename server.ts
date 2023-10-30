import * as fs from "node:fs";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler, type RequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import sourceMapSupport from "source-map-support";

// patch in Remix runtime globals
installGlobals();
sourceMapSupport.install();

/**
 * @typedef {import('@remix-run/node').ServerBuild} ServerBuild
 */
const BUILD_PATH = "./build/index.js";
const WATCH_PATH = "./build/version.txt";

/**
 * Initial build
 * @type {ServerBuild}
 */
let build = await import(BUILD_PATH);

// We'll make chokidar a dev dependency so it doesn't get bundled in production.
const chokidar =
  process.env.NODE_ENV === "development" ? await import("chokidar") : null;

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

// Check if the server is running in development mode and use the devBuild to reflect realtime changes in the codebase.
app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler()
    : createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Express server listening on port ${port}`);

  // send "ready" message to dev server
  if (process.env.NODE_ENV === "development") {
    await broadcastDevReady(build);
  }
});

// Create a request handler that watches for changes to the server build during development.
function createDevRequestHandler(): RequestHandler {
  async function handleServerUpdate() {
    // 1. re-import the server build
    build = await reimportServer();

    // Add debugger to assist in v2 dev debugging
    if (build?.assets === undefined) {
      console.log(build.assets);
      debugger;
    }

    // 2. tell dev server that this app server is now up-to-date and ready
    await broadcastDevReady(build);
  }

  chokidar
    ?.watch(WATCH_PATH, { ignoreInitial: true })
    .on("add", handleServerUpdate)
    .on("change", handleServerUpdate);

  // wrap request handler to make sure its recreated with the latest build for every request
  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// ESM import cache busting
/**
 * @type {() => Promise<ServerBuild>}
 */
async function reimportServer() {
  const stat = fs.statSync(BUILD_PATH);

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_PATH + "?t=" + stat.mtimeMs);
}

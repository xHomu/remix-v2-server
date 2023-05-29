import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from "chokidar";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { ServerBuild, broadcastDevReady, installGlobals } from "@remix-run/node";

// @ts-ignore - this file may not exist if you haven't built yet, but it will
// definitely exist by the time the dev or prod server actually runs.
import * as remixBuild from "./build/index.js";
const build = remixBuild as unknown as ServerBuild
let devBuild = build

const BUILD_PATH = "./build/index.js";

installGlobals();

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

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? async (req, res, next) => {
      try {
        return createRequestHandler({
          build: devBuild,
          mode: "development",
        })(req, res, next);
      } catch (error) {
        next(error);
      }
    }
    : createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Express server listening on port ${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
});

// during dev, we'll keep the build module up to date with the changes
if (process.env.NODE_ENV === 'development') {
	async function reloadBuild() {
		devBuild = await import(`${BUILD_PATH}?update=${Date.now()}`)
		broadcastDevReady(devBuild)
	}

	const dirname = path.dirname(fileURLToPath(import.meta.url))
	const watchPath = path.join(dirname, BUILD_PATH).replace(/\\/g, '/')
	const watcher = chokidar.watch(watchPath, { ignoreInitial: true })
	watcher.on('all', reloadBuild)
}
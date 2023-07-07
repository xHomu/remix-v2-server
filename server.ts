import path from "path";
import chokidar from "chokidar";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";

const BUILD_DIR = path.join(process.cwd(), "build");

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

// Check if the server is running in development mode and use the devBuild to reflect realtime changes in the codebase.
app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? async (req, res, next) => {
        try {
          return createRequestHandler({
            build: require(BUILD_DIR),
            mode: process.env.NODE_ENV,
          })(req, res, next);
        } catch (error) {
          next(error);
        }
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Express server listening on port ${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(require(BUILD_DIR));
  }
});

// during dev, we'll keep the build module up to date with the changes
async function updateServer() {
  // 1. purge require cache && load updated server build
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
  // 2. tell dev server that this app server is now ready
  broadcastDevReady(require(BUILD_DIR));
}

if (process.env.NODE_ENV === "development") {
  const watcher = chokidar.watch(BUILD_DIR, {
    ignored: ["**/**.map"],
  });

  watcher.on("add", updateServer);
  watcher.on("change", updateServer);
}

import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler, type RequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import sourceMapSupport from "source-map-support";
import {
  unstable_createViteServer,
  unstable_loadViteServerBuild,
} from "@remix-run/dev";

// patch in Remix runtime globals
installGlobals();
sourceMapSupport.install();

const app = express();

// handle asset requests
let vite =
  process.env.NODE_ENV === "production"
    ? undefined
    : await unstable_createViteServer();

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
} else {
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );
}

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all(
  "*",
  createRequestHandler({
    build: vite
      ? () => unstable_loadViteServerBuild(vite)
      : await import("./build/index.js"),
  })
);

const port = process.env.PORT || 3000;
console.log(`Express server listening on http://localhost:${port}`);

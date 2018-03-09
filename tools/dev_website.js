#!/usr/bin/env node
const run = require("./run");
const fs = require("fs");
const Bundler = require("parcel-bundler");
require("ts-node").register({"typeCheck": true });
const gendoc = require("./gendoc.ts");

run.mkdir("build");
run.mkdir("build/website");  // for docs.json
run.mkdir("build/website2");
run.mkdir("build/website2/docs");
run.mkdir("build/website2/notebook");
run.mkdir("build/website2/src"); // Needed for npy_test

run.symlink(run.root + "/website/", "build/website2/static");
run.symlink(run.root + "/website/img", "build/website2/img");
run.symlink(run.root + "/deps/data/", "build/website2/data");
// Needed for npy_test
run.symlink(run.root + "/src/testdata/", "build/website2/src/testdata");

const opts = {
  cache: true,
  hmr: false,
  logLevel: process.env.CI ? 1 : null,
  minify: false,
  outDir: "build/website2/",
  production: false,
  publicUrl: "/",
  watch: true
}

const sandboxBunder = new Bundler("website/sandbox.ts", opts);
sandboxBunder.bundle();

const docs = gendoc.genJSON();
const docsJson = JSON.stringify(docs, null, 2);
fs.writeFileSync("build/website/docs.json", docsJson);
fs.writeFileSync("build/website2/docs.json", docsJson);

const indexBunder = new Bundler("website/index.html", opts);
const port = 8080
indexBunder.serve(port);

console.log(`Propel dev http://127.0.0.1:${port}/`);

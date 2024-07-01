#!/usr/bin/env node
/*! create-gy-vue v1.0.0 | ISC */

// index.ts
var import_node_util = require("util");
import getLanguage from './utils/getLanguage'

async function init() {
  const cwd = process.cwd();
  const args = process.argv.slice(2);
  const options = {
    typescript: { type: "boolean" },
    ts: { type: "boolean" },
    "with-tests": { type: "boolean" },
    tests: { type: "boolean" },
    "vue-router": { type: "boolean" },
    router: { type: "boolean" },
    "vue-devtools": { type: "boolean" },
    devtools: { type: "boolean" }
  };
  const { values: argv, positionals } = (0, import_node_util.parseArgs)({
    args,
    options,
    strict: false
  });
  let targetDir = positionals[0];
  const defaultProjectName = !targetDir ? 'vue-project' : targetDir
  console.log(targetDir);

  const language = getLanguage()
  let result = {};
  try {
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
  console.log(result);
}
init();

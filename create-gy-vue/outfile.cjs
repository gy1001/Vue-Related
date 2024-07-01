#!/usr/bin/env node
/*! create-gy-vue v1.0.0 | ISC */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var import_prompts = __toESM(require("prompts"));
var import_node_util = require("util");

// utils/getLanguage.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function linkLocale(locale) {
  let linkedLocale;
  try {
    linkedLocale = Intl.getCanonicalLocales(locale)[0];
    switch (linkedLocale) {
      case "zh-TW":
      case "zh-HK":
      case "zh-MO":
        linkedLocale = "zh-Hant";
        break;
      case "zh-CN":
      case "zh-SG":
        linkedLocale = "zh-Hans";
        break;
      default:
        linkedLocale = locale;
    }
    return linkedLocale;
  } catch (error) {
    console.log(`${error.toString()}
`);
  }
}
function getLocale() {
  const shellLocale = process.env.LC_ALL || // POSIX locale environment variables
  process.env.LC_MESSAGES || process.env.LANG || Intl.DateTimeFormat().resolvedOptions().locale || // Built-in ECMA-402 support
  "en-US";
  return linkLocale(shellLocale.split(".")[0].replace("_", "-"));
}
function getLanguage() {
  const locale = getLocale();
  const localesRoot = path.resolve(__dirname, "locales");
  const languageFilePath = path.resolve(localesRoot, `${locale}.json`);
  const doesLanguageExist = fs.existsSync(languageFilePath);
  const lang = doesLanguageExist ? require(languageFilePath) : require(path.resolve(localesRoot, "en-US.json"));
  return lang;
}

// index.ts
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
  const defaultProjectName = !targetDir ? "vue-project" : targetDir;
  console.log(targetDir);
  const language = getLanguage();
  let result = {};
  try {
    result = await (0, import_prompts.default)([
      {
        name: "projectName",
        type: targetDir ? null : "text",
        message: language.projectName.message,
        initial: defaultProjectName,
        onState: (state) => targetDir = String(state.value).trim() || defaultProjectName
      }
    ]);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
  console.log(result);
}
init();

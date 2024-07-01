#!/usr/bin/env node


import prompts from 'prompts'
import { parseArgs } from 'node:util'

async function init() {
  const cwd = process.cwd();

  const args = process.argv.slice(2);

  // alias is not supported by parseArgs
  const options = {
    typescript: { type: 'boolean' },
    ts: { type: 'boolean' },
    'with-tests': { type: 'boolean' },
    tests: { type: 'boolean' },
    'vue-router': { type: 'boolean' },
    router: { type: 'boolean' },
    'vue-devtools': { type: 'boolean' },
    devtools: { type: 'boolean' }
  } as const

  const { values: argv, positionals } = parseArgs({
    args,
    options,
    strict: false
  })


  let targetDir = positionals[0]
  console.log(targetDir)

  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    packageName?: string
    needsTypeScript?: boolean
    needsJsx?: boolean
    needsRouter?: boolean
    needsPinia?: boolean
    needsVitest?: boolean
    needsE2eTesting?: false | 'cypress' | 'nightwatch' | 'playwright'
    needsEslint?: boolean
    needsPrettier?: boolean
    needsDevTools?: boolean
  } = {}


  try{

  }catch(error) {
    console.log(error.message)
    process.exit(1)
  }

  console.log(result)

}

init();

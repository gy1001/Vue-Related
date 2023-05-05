#!/usr/bin/env node
const { program } = require('commander')
const pkg = require('../package.json')
const checkNode = require('../lib/checkNode')
const startServer = require('../lib/start/startServer')
const build = require('../lib/build/buildServer')
;(async function () {
  try {
    const MIN_NODE_VERSION = '8.9.0'
    if (!checkNode(MIN_NODE_VERSION)) {
      throw new Error(
        'Please upgrade your node version to v' + MIN_NODE_VERSION,
      )
    }
    // 设置版本号
    program.version(pkg.version)
    // 增加一个全局的 -d 表示 debug 模式
    program
      .option('-d --debug', '开启调试模式')
      .hook('preAction', (thisCommand, actionCommand) => {
        const { debug } = actionCommand.optsWithGlobals()
        if (debug) {
          process.env.LOG_LEVEL = 'verbose'
        }
      })
    // 增加一个 start 命令
    program
      .command('start')
      .option('-c --config <config>', '配置文件路径')
      .option('--stop-server', '停止服务')
      .option('--custom-webpack-path <customeWebpackPath>', '自定义webpack路径')
      .description('start server by imooc-build ')
      .allowUnknownOption()
      .action(startServer)
    // 增加一个 build 命令
    program
      .command('build')
      .option('-c --config <config>', '配置文件路径')
      .option('--custom-webpack-path <customeWebpackPath>', '自定义webpack路径')
      .description('build server by imooc-build')
      .allowUnknownOption()
      .action(build)

    program.parse(process.argv)
  } catch (error) {
    console.log(error.message)
  }
})()

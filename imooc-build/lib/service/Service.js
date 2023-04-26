// const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const path = require('path')

const fs = require('fs')
const log = require('../../utils/log')
const { getConfigFile } = require('../../utils')
class Service {
  constructor(opts) {
    this.args = opts
    this.config = {}
    this.hooks = {}
    // this.dir = process.cwd()
  }
  start() {
    console.log('启动服务')
    this.resolveConfig()
  }
  // 解析配置文件
  async resolveConfig() {
    log.verbose('解析配置文件', this.args)
    log.info('解析配置文件', this.args)
    const { config } = this.args
    let configPath = config
    if (config) {
      if (path.isAbsolute(config)) {
        configPath = config
      } else {
        configPath = path.resolve(config)
      }
    } else {
      // 如果没有配置，就查找默认文件
      configPath = getConfigFile()
    }
    let configParams = {}
    if (configPath && fs.existsSync(configPath)) {
      const isJson = configPath.endsWith('.json')
      const isJs = configPath.endsWith('.js')
      const isMjs = configPath.endsWith('.mjs')
      if (isJson) {
        configParams = require(configPath)
      } else if (isJs) {
        configParams = require(configPath)
      } else if (isMjs) {
        configParams = await import(configPath)
        configParams = configParams.default
      }
      console.log(configParams)
    } else {
      console.log('配置文件不存在，终止执行')
      process.exit(1)
    }
  }
}

module.exports = Service
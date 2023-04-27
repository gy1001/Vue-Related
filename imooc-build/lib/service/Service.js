// const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const path = require('path')

const fs = require('fs')
const log = require('../../utils/log')
const { getConfigFile, loadMoudle } = require('../../utils')
const { HOOK_START } = require('./const')
const HOOKSARR = [HOOK_START]
class Service {
  constructor(opts) {
    this.args = opts
    this.config = {}
    this.hooks = {}
    // this.dir = process.cwd()
  }
  async start() {
    await this.resolveConfig()
    await this.registerHooks()
    this.emitHooks(HOOK_START)
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
      this.config = configParams
    } else {
      console.log('配置文件不存在，终止执行')
      process.exit(1)
    }
  }

  // 注册钩子函数
  async registerHooks() {
    log.verbose('解析hooks')
    // hooks 数据结构 [["int", function()],"success", function(){}]
    const { hooks } = this.config
    for (const hook of hooks) {
      const [key, fn] = hook
      if (
        key &&
        HOOKSARR.indexOf(key) !== -1 &&
        fn &&
        typeof key === 'string'
      ) {
        const existHook = this.hooks[key]
        if (!existHook) {
          this.hooks[key] = []
        }
        if (typeof fn === 'function') {
          this.hooks[key].push(fn)
        } else if (typeof fn === 'string') {
          this.hooks[key].push(await loadMoudle(fn))
        }
      }
    }
    log.verbose('hooks', this.hooks)
  }

  // 触发钩子函数
  async emitHooks(key) {
    const hook = this.hooks[key]
    if (hook) {
      for (const fn of hook) {
        try {
          await fn(this)
        } catch (error) {
          log.error(error)
        }
      }
    }
  }
}

module.exports = Service

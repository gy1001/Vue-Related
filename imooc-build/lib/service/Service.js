// const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const path = require('path')

const fs = require('fs')
const log = require('../../utils/log')
const { getConfigFile, loadMoudle } = require('../../utils')
const { HOOK_START } = require('./const')
const HOOKSARR = [HOOK_START]
const Config = require('webpack-chain')

class Service {
  constructor(opts) {
    this.args = opts
    this.config = {}
    this.hooks = {}
    this.plugins = []
    this.webpackConfig = new Config()
    // this.dir = process.cwd()
  }
  async start() {
    await this.resolveConfig()
    await this.registerWebpackConfig()
    await this.registerHooks()
    await this.emitHooks(HOOK_START)
    await this.registerPlugin()
    await this.runPlugin()
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

  // 注册webpack 配置
  registerWebpackConfig() {
    // entry: { inedx: "index.js" }
    this.webpackConfig
      .entry('index')
      .add('src/index.js')
      .end()
      .output.path('dist')
      .filename('[name].bundle.js')
    const entry = this.webpackConfig.entry('index')
    console.log(entry)
    entry.clear()
    entry.add('src/main.js').add('src/bundle.js')

    log.verbose('webpack config', this.webpackConfig.toConfig())
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
  // 注册插件
  // 支持的插件形式繁多
  // 1. 数组形式：[[xxx, { xx: xxx}], "xxx"]
  // 2. 也支持 前面是函数名，后面是具体的函数实现：[['xxx', function(){ }]]
  // 3. 就是一个函数 [ function(){ }, ]
  async registerPlugin() {
    let { plugins } = this.config
    if (plugins) {
      if (typeof plugins === 'function') {
        plugins = plugins()
      }
      if (Array.isArray(plugins)) {
        for (const plugin of plugins) {
          if (typeof plugin === 'string') {
            const module = await loadMoudle(plugin)
            this.plugins.push({ mod: module })
          } else if (Array.isArray(plugin)) {
            const [pluginPath, pluginParams] = plugin
            const module = await loadMoudle(pluginPath)
            this.plugins.push({
              mod: module,
              params: pluginParams,
            })
          } else if (typeof plugin === 'function') {
            this.plugins.push({ mode: plugin })
          }
        }
      }
    }
  }

  // 运行插件
  async runPlugin() {
    log.verbose('run plugins', this.plugins)
  }
}

module.exports = Service

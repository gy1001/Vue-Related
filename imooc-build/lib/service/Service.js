// const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const path = require('path')

const fs = require('fs')
const log = require('../../utils/log')
const { getConfigFile, loadMoudle } = require('../../utils')
const { HOOK_START, PLUGIN_HOOK } = require('./const')
const HOOKSARR = [HOOK_START, PLUGIN_HOOK]
const Config = require('webpack-chain')
const InitPlugin = require('../../plugins/initPlugin/index')

class Service {
  constructor(opts) {
    this.args = opts
    this.config = {}
    this.hooks = {}
    this.plugins = []
    this.webpackConfig = new Config()
    this.internalValue = {}
    this.log = log
    this.webpack = ''
    // this.dir = process.cwd()
  }
  async start() {
    await this.resolveConfig()
    await this.registerWebpackConfig()
    await this.registerHooks()
    await this.emitHooks(HOOK_START)
    await this.registerPlugin()
    await this.runPlugin()
    await this.initWebpack()
    //完成 webpack 配置（借助plugin webpack.config.js）
    // 完成 webpack-dev-server 的启动
    // log.verbose('this.webpack', this.webpack)
    log.verbose('webpack config', this.webpackConfig.toConfig().module.rules)
  }

  async initWebpack() {
    // 从 config 中获取 CustomeWebpackPath 属性
    // CustomeWebpackPath存在shi，则使用改地址应用 webpack
    // 否则则使用 node_modules 中的 webapack
    const { customWebpackPath } = this.args
    if (customWebpackPath) {
      if (fs.existsSync(customWebpackPath)) {
        let p = customWebpackPath
        if (!path.isAbsolute(p)) {
          p = path.resolve(p)
        }
        this.webpack = require.resolve(p)
      }
    } else {
      this.webpack = require.resolve('webpack', {
        paths: [path.resolve(process.cwd(), 'node_modules')],
      })
    }
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
    // this.webpackConfig
    //   .entry('index')
    //   .add('src/index.js')
    //   .end()
    //   .output.path('dist')
    //   .filename('[name].bundle.js')
    // const entry = this.webpackConfig.entry('index')
    // entry.clear()
    // entry.add('src/main.js').add('src/bundle.js')
    // if (entry.has('src/main.js')) {
    //   entry.delete('src/main.js')
    // }
    // this.webpackConfig.module
    //   .rule('lint')
    //   .test('/.js$/')
    //   .include.add('src')
    //   .end()
    //   .exclude.add('node_modules')
    //   .end()
    //   .use('eslint')
    //   .loader('eslint-loader')
    //   .options({
    //     rules: {
    //       semi: 'off',
    //     },
    //   })
    // const lintRule = this.webpackConfig.module.rule('lint') // 注意这个名字和前面一致
    // lintRule.include.clear()
    // lintRule.exclude.clear()
    // lintRule.uses.clear()
    // log.verbose(
    //   'webpack config',
    //   JSON.stringify(this.webpackConfig.toConfig(), null, 2),
    // )
    // this.webpackConfig.plugin('clean').use('webpack-chain', [{ root: '/dir' }])
    // log.verbose('webpack config', this.webpackConfig.toConfig())
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
    const buildInPlugins = [InitPlugin]
    buildInPlugins.forEach((buildPlugin) => {
      this.plugins.push({
        mod: buildPlugin,
      })
    })
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
            this.plugins.push({ mod: plugin })
          }
        }
      }
    }
  }

  // 运行插件
  async runPlugin() {
    for (const plugin of this.plugins) {
      const API = {
        getWebpackConfig: this.getWebpackConfig.bind(this),
        emitHooks: this.emitHooks.bind(this),
        setValue: this.setValue.bind(this),
        getValue: this.getValue.bind(this),
        log,
      }
      const { mod, params } = plugin
      if (!mod) {
        continue
      }
      const options = {
        ...params,
      }
      await mod(API, options)
    }
  }

  getWebpackConfig() {
    return this.webpackConfig
  }

  setValue(key, value) {
    this.internalValue[key] = value
  }

  getValue(key) {
    return this.internalValue[key]
  }
}

module.exports = Service

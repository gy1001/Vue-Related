const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const fg = require('fast-glob')
const fs = require('fs')
const path = require('path')
const log = require('./log')
function getConfigFile({ cwd = process.cwd() } = {}) {
  const arr = fg.sync(DEFAULT_CONFIG_NAME, {
    cwd,
    absolute: true,
  })
  return arr[arr.length - 1]
}

async function loadMoudle(modulePath) {
  let configPath
  if (modulePath.indexOf('/') !== -1 || modulePath.indexOf('.') !== -1) {
    // 说明他是一个路径
    configPath = path.isAbsolute(modulePath)
      ? modulePath
      : path.resolve(modulePath)
  } else {
    // 它是一个包, 需要借助 require.resolve 来加载 运行命令目录下的 node_modules下的文件或者一层层往上找
    configPath = require.resolve(modulePath, {
      paths: [path.resolve(process.cwd())],
    })
  }
  if (fs.existsSync(configPath)) {
    const isJson = configPath.endsWith('.json')
    const isJs = configPath.endsWith('.js')
    const isMjs = configPath.endsWith('.mjs')
    let configParams = {}
    if (isJson) {
      configParams = require(configPath)
    } else if (isJs) {
      configParams = require(configPath)
    } else if (isMjs) {
      configParams = (await import(configPath)).default
    }
    return configParams
  } else {
    return ''
  }
}

module.exports = { getConfigFile, loadMoudle }

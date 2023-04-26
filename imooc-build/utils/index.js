const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const fg = require('fast-glob')

function getConfigFile({ cwd = process.cwd() } = {}) {
  const arr = fg.sync(DEFAULT_CONFIG_NAME, {
    cwd,
    absolute: true,
  })
  return arr[arr.length - 1]
}

module.exports = { getConfigFile }

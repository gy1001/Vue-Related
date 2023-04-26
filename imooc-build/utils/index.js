const DEFAULT_CONFIG_NAME = ['imooc-build.config.+(json|mjs|js)']
const fg = require('fast-glob')

function getConfigFile({ cwd = process.cwd() } = {}) {
  const [configFile] = fg.sync(DEFAULT_CONFIG_NAME, {
    cwd,
    absolute: true,
  })

  return configFile
}

module.exports = { getConfigFile }

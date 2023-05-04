const path = require('path')
module.exports = function startPluginFirst(api, params) {
  const { getWebpackConfig } = api
  const dir = process.cwd()
  const config = getWebpackConfig()
  config.entry('login').add(path.resolve(dir, 'src/login.js')).end()
}

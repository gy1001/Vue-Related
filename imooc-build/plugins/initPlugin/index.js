const path = require('path')

module.exports = function initPlugin(api, params) {
  console.log('init plugin')
  const { getWebpackConfig } = api
  const config = getWebpackConfig()
  // 获取构建模式
  const mode = process.env.IMOOC_BUILD_MODE || 'development'
  config.mode(mode)
  // 设置 entry
  const dir = process.cwd()
  config.entry('index').add(path.resolve(dir, './src/index.js'))
  config.output.filename('js/[name].js').path(path.resolve(dir, '../dist'))
}

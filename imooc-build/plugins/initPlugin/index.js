module.exports = function initPlugin(api, params) {
  console.log('init plugin')
  const { getWebpackConfig } = api
  const config = getWebpackConfig()
  // 获取构建模式
  const mode = process.env.IMOOC_BUILD_MODE || 'development'
  config.mode(mode)
  console.log('mode', config.toConfig())
}

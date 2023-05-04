const { VueLoaderPlugin } = require('vue-loader')

module.exports = function (api, params) {
  const config = api.getWebpackConfig()
  config.module
    .rule('vue')
    .exclude.add(/node_modules/)
    .end()
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')
  config.plugin('VueLoaderPlugin').use(VueLoaderPlugin)
}

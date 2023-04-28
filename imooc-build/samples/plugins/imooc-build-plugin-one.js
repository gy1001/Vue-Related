module.exports = function startPluginFirst(api, params) {
  const { getWebpackConfig } = api
  const config = getWebpackConfig()
  config
    .entry('index2')
    .add('src/index2.js')
    .end()
    .output.filename('[name].bundle.js')
    .path('dist')
}

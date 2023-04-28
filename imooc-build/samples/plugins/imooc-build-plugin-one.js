module.exports = function startPluginFirst(api, params) {
  const { getWebpackConfig, setValue } = api
  const config = getWebpackConfig()
  config
    .entry('index2')
    .add('src/index2.js')
    .end()
    .output.filename('[name].bundle.js')
    .path('dist')
  setValue('name', {
    name: '孙悟空',
    value: '123456',
    fn: function () {
      return 'test'
    },
  })
}

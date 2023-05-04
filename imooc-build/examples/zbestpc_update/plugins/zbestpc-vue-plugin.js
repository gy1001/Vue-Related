const path = require('path')
const dir = process.cwd()

module.exports = function (api, params) {
  console.log('i am a vue plugin')
  // 配置内容有所修改
  const config = api.getWebpackConfig()
  config.entry('index').clear().add(path.resolve(dir, './src/main.js'))
  console.log(config.toConfig())
}

const path = require('path')
const dir = process.cwd()
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (api, params) {
  console.log('i am a vue plugin')
  // 配置内容有所修改
  const config = api.getWebpackConfig()
  config.entry('index').clear().add(path.resolve(dir, './src/main.js'))
  config.entry('login').add(path.resolve(dir, './src/login.js'))
  config.plugin('index').use(HtmlWebpackPlugin, [
    {
      filename: 'index.html',
      template: path.resolve(dir, './public/index-vue.html'),
      chunks: ['index'],
    },
  ])
  config.module
    .rule('ejs')
    .exclude.add(/node_modules/)
    .end()
    .test(/\.ejs$/)
    .use('ejs-loader')
    .options({
      esModule: false,
    })
  config.module
    .rule('vue')
    .exclude.add(/node_modules/)
    .end()
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')

  config
    .plugin('provide')
    .use(webpack.ProvidePlugin, [{ $: 'jquery', jQuery: 'jquery' }])

  config.plugin('CopyWebpackPlugin').use(CopyWebpackPlugin, [
    {
      patterns: [
        {
          from: path.resolve(dir, './src/img'),
          to: path.resolve(dir, './dist/img'),
        },
      ],
    },
  ])

  config.plugin('VueLoaderPlugin').use(VueLoaderPlugin)
  config.devServer
    .compress(true)
    .proxy({
      '/': {
        target: 'http://localhost:8080',
        // 只需要添加该方法，然后当请求的是html，则重定向到index.html
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.')
            return '/index.html'
          }
        },
      },
    })
    .set('static', { directory: path.resolve(dir, './dist') })
}

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webapck = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (api, params) {
  console.log('this is zbest-pc plugin')
  const config = api.getWebpackConfig()
  const dir = process.cwd()
  config.entry('login').add(path.resolve(dir, './src/login.js'))

  config.plugin('login').use(HtmlWebpackPlugin, [
    {
      filename: 'login.html',
      template: path.resolve(dir, './public/login.html'),
      chunks: ['login'],
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

  config
    .plugin('provide')
    .use(webapck.ProvidePlugin, [{ $: 'jquery', jQuery: 'jquery' }])

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
}

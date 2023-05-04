const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webapck = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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
  // 配置 module
  config.module
    .rule('css')
    .test(/\.css$/)
    .exclude.add(/node_modules/)
    .end()
    .use('min-css')
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use('css-loader')
    .loader('css-loader')
    .end()
  config.module
    .rule('asset')
    .test(/\.(png|svg|jpg|png|jpeg|gif)$/i)
    .type('asset')
    .parser({
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    })
  config.module.rule('asset').set('generator', {
    filename: 'img/[name].[contenthash:6][ext]', // 解决重名问题
  })
  // .generator({
  //   filename: 'img/[name].[contenthash:6][ext]', // 解决重名问题
  // })
  config.module
    .rule('ejs')
    .exclude.add(/node_modules/)
    .end()
    .test(/\.ejs$/)
    .use('ejs-loader')
    .options({
      esModule: false,
    })
  // 配置 plugins
  config.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
    {
      filename: 'css/[name][contenthash:8].css',
      chunkFilename: 'css/[name].chunk.css',
    },
  ])
  config.plugin('indexHtml').use(HtmlWebpackPlugin, [
    {
      filename: 'index.html',
      template: path.resolve(dir, './public/index-vue.html'),
      chunks: ['home'],
    },
  ])
  config.plugin('loginHtml').use(HtmlWebpackPlugin, [
    {
      filename: 'login.html',
      template: path.resolve(dir, './public/index-vue.html'),
      chunks: ['login'],
    },
  ])
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
  config.plugin('cleanWebpack').use(CleanWebpackPlugin, [])
}

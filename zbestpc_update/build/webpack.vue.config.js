const path = require('path')
const webapck = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const resolve = (dirPath) => path.resolve(__dirname, dirPath)
// 对于 vue-loader 需要结合它的插件一起使用
const { VueLoaderPlugin } = require('vue-loader')
const config = {
  mode: 'development',
  // 入口文件修改为 main.js
  entry: resolve('../src/main.js'),
  output: {
    filename: 'js/[name].js',
    path: resolve('../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('../public/index-vue.html'), // 模板改为 index-vue.html
    }),
    new webapck.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('../src/img'),
          to: resolve('../dist/img'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].chunk.css',
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.(png|svg|jpg|png|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:6].[ext]', // 解决重名问题
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: resolve('../dist'),
    },
    compress: true,
    port: 9001,
    hot: true,
    proxy: {
      '/': {
        target: 'http://localhost:9000',
        // 只需要添加该方法，然后当请求的是html，则重定向到index.html
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.')
            return '/index.html'
          }
        },
      },
    },
  },
  optimization: {
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({ sourceMap: true }), // 在本地运行时候需要把此处设置为 false,否则会报错
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 300 * 1024,
      name: 'common',
      cacheGroups: {
        jquery: {
          name: 'jquery',
          test: /jquery/,
          chunks: 'all',
        },
      },
    },
  },
}

module.exports = config

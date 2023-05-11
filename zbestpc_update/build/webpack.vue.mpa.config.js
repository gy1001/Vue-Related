const path = require('path')
const webapck = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const resolve = (dirPath) => path.resolve(__dirname, dirPath)
const { VueLoaderPlugin } = require('vue-loader')
const config = {
  mode: 'development',
  entry: {
    // 增加多入口文件
    home: resolve('../src/mpa/home.js'),
    login: resolve('../src/mpa/login.js'),
  },
  output: {
    filename: 'js/[name].js',
    path: resolve('../dist'),
  },
  plugins: [
    // 增加多入口模板文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('../public/index-vue.html'),
      chunks: ['home'],
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: resolve('../public/index-vue.html'),
      chunks: ['login'],
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
      filename: 'css/[name][contenthash:8].css',
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
          filename: 'img/[name].[contenthash:6][ext]', // 解决重名问题
        },
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false,
            },
          },
        ],
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
    minimize: true, // 默认开发模式下不压缩
    minimizer: [
      new UglifyJsPlugin({ sourceMap: false }),
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

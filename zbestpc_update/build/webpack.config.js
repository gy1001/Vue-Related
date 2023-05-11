const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webapck = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const resolve = (dirPath) => path.resolve(__dirname, dirPath)

module.exports = {
  mode: 'production',

  entry: {
    index: resolve('../src/index.js'),
    login: resolve('../src/login.js'),
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].[hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('../public/index.html'),
      chunks: ['index'], // 新增加
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: resolve('../public/login.html'),
      chunks: ['login'], // 新增加
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
  ],
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
          filename: 'images/[name].[hash:6].[ext]', // 解决重名问题
        },
      },
    ],
  },
  optimization: {
    minimize: true, // 默认开发模式下不压缩
    minimizer: [new UglifyJsPlugin({ sourceMap: true })],
    minimizer: [
      new UglifyJsPlugin({ sourceMap: true }),
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
  devServer: {
    static: {
      directory: resolve('../dist'),
    },
    compress: true,
    port: 9001,
    hot: true,
  },
}

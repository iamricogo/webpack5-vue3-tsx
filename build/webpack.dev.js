/*
 * @Author: Rico
 * @Date: 2021-08-02 14:51:29
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 19:33:27
 * @Description:
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')
const path = require('path')
const open = require('opn') //打开浏览器
const chalk = require('chalk') // 改变命令行中输出日志颜色插件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { createCssLoader } = require('./utils')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  cache: {
    type: 'filesystem'
  },
  output: {
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: '../dist',
    host: '0.0.0.0',
    overlay: true,
    stats: 'errors-only',
    compress: true, // 为每个静态文件开启 gzip compression
    after() {
      open('http://localhost:' + this.port)
        .then(() => {
          console.log(chalk.cyan('成功打开链接： http://localhost:' + this.port))
        })
        .catch((err) => {
          console.log(chalk.red(err))
        })
    },
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }]
    }
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: createCssLoader('scss', { modules: true })
          },
          {
            test: /\.module\.\w+$/,
            use: createCssLoader('scss', { modules: true })
          },
          {
            use: createCssLoader('scss')
          }
        ]
      },
      {
        test: /\.less$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: createCssLoader('less', { modules: true })
          },
          {
            test: /\.module\.\w+$/,
            use: createCssLoader('less', { modules: true })
          },
          {
            use: createCssLoader('less')
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|cur)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [new FriendlyErrorsWebpackPlugin()],
  mode: 'development'
})

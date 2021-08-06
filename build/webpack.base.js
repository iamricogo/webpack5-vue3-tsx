/*
 * @Author: Rico
 * @Date: 2021-07-31 08:43:06
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 19:39:58
 * @Description:
 */
const fs = require('fs')
const chalk = require('chalk')
const { resolve } = require('path')
const dayjs = require('dayjs')
const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { createCssLoader, isDev } = require('./utils')
module.exports = {
  entry: ['./src/main.ts'],
  target: 'web',
  output: {
    filename: isDev() ? '[name].bundle.js' : 'js/[name].[contenthash].js',
    assetModuleFilename: 'assets/[name].[contenthash][ext]',
    path: resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      // 处理vue
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: createCssLoader('sass')
      },
      {
        test: /\.less$/,
        use: createCssLoader('less')
      },
      // 处理其它资源
      {
        test: /\.(woff2?|eot|ttf|otf|png|svg|jpg|gif|cur|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        }
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      fix: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
    }),
    new StylelintPlugin({
      fix: true,
      extensions: ['css', 'scss', 'sass', '.vue']
      // lintDirtyModulesOnly: true
    }),
    new VueLoaderPlugin(),
    new ProgressBarPlugin({
      format: `${chalk.cyan.bold(`build `)}${chalk.bold('[')}:bar${chalk.bold(
        ']'
      )}${chalk.green.bold(' :percent')} (:elapsed seconds)`
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new HtmlWebpackPlugin({
      version: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      template: resolve(__dirname, '../index.html')
    }),
    // 处理静态文件夹 public 复制到打包的 public 文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '../public'),
          toType: 'dir'
        }
      ].filter(({ from }) => fs.existsSync(from))
    }),

    // fork-ts-checker-webpack-plugin，顾名思义就是创建一个新进程，专门来运行Typescript类型检查。这么做的原因是为了利用多核资源来提升编译的速度
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    alias: {
      '@': resolve('src')
      // 'vue-types': 'vue-types/shim',/** 源码中shim有bug extend方法不支持数组，导致ant-design-vue报错 github已修复并提交Pr 待回应 暂时屏蔽使用   */
    }
  }
}

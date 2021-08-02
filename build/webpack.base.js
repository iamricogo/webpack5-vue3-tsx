/*
 * @Author: Rico
 * @Date: 2021-07-31 08:43:06
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 19:39:58
 * @Description:
 */
const fs = require('fs')
const path = require('path')
// vue-loader 插件, 需配合 @vue/compiler-sfc 一块使用
const { VueLoaderPlugin } = require('vue-loader')
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dayjs = require('dayjs')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  entry: ['./src/main.ts'],
  target: 'web',
  module: {
    rules: [
      // 处理vue
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 处理字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        }
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new ESLintPlugin({ fix: true, extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'] }),
    new StylelintPlugin({
      fix: true,
      extensions: ['css', 'scss', 'sass', '.vue'],
      lintDirtyModulesOnly: true
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // 处理静态文件夹 public 复制到打包的 public 文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: 'public',
          toType: 'dir',
          globOptions: {
            ignore: ['**/root/**', 'index.html']
          }
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
    }
  }
}

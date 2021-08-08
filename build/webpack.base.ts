import { Configuration, DefinePlugin } from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { babelExclude, createCssLoader, progressBarFormatter } from './utils'
import { resolve } from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin'
import StylelintWebpackPlugin from 'stylelint-webpack-plugin'
import dayjs from 'dayjs'
import fs from 'fs'

const config: Configuration = {
  entry: ['./src/main.ts'],
  target: 'web',
  output: {
    filename: 'assets/[name].bundle.js',
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
        exclude: (filepath) => babelExclude(filepath, []),
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
    ProgressBarWebpackPlugin({
      complete: '■',
      format: progressBarFormatter()
    }),
    new ESLintWebpackPlugin({
      fix: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
    }),
    new StylelintWebpackPlugin({
      fix: true,
      extensions: ['css', 'scss', 'sass', '.vue']
      // lintDirtyModulesOnly: true
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new HtmlWebpackPlugin({
      version: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      template: resolve(__dirname, '../index.html')
    }),

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

export default config

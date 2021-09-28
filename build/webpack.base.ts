import { Configuration, ContextReplacementPlugin, DefinePlugin } from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import { babelExclude, createCssLoader } from './lib/util/loader'
import { progressBarFormatter } from './lib/util/log'
import { resolve } from 'path'
import { transpileDependencies } from './config/babel.config'
import CaseSensitivePathsWebpackPlugin from 'case-sensitive-paths-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin'
import SpritesmithPlugin from './config/sprites.config'
import StylelintWebpackPlugin from 'stylelint-webpack-plugin'
import fs from 'fs'

const config: Configuration = {
  entry: ['./src/main.ts'],
  target: 'web',
  output: {
    filename: 'assets/[name].bundle.js',
    assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
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
        exclude: (filepath) =>
          babelExclude(filepath, transpileDependencies || []),
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: createCssLoader('sass')
          },
          {
            test: /\.module\.\w+$/,
            use: createCssLoader('sass')
          },
          {
            use: createCssLoader('sass', { modules: false })
          }
        ]
      },
      {
        test: /\.less$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: createCssLoader('less')
          },
          {
            test: /\.module\.\w+$/,
            use: createCssLoader('less')
          },
          {
            use: createCssLoader('less', { modules: false })
          }
        ]
      },
      // 处理其它资源
      {
        test: /\.(woff2?|eot|ttf|otf|png|svg|jpe?g|gif|cur|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: (source, { filename }) => {
            const rule1 = Buffer.byteLength(source) <= 8 * 1024
            const isSpritesmith = /_spritesmith[\\/]/.test(filename)
            return rule1 && !isSpritesmith
          }
        }
      },
      // 处理精灵图位置描述资源
      {
        test: /\.sprites\.(text|json|(ht|x)ml)(\?.*)?$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'sprites-loader.ts',
            options: {
              esModule: false
            }
          }
        ]
      },
      // 处理骨骼资源
      {
        test: /\.spine\.json(\?.*)?$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'spine-loader.ts',
            options: {
              esModule: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ProgressBarWebpackPlugin({
      complete: '■',
      format: progressBarFormatter()
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en-nz/),
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
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: true,
      __INTLIFY_PROD_DEVTOOLS__: false
    }),
    new HtmlWebpackPlugin({
      version: new Date().toString(),
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
    new ForkTsCheckerWebpackPlugin(),
    new CaseSensitivePathsWebpackPlugin(),
    ...SpritesmithPlugin
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    alias: {
      '@': resolve('src')
    }
  },
  resolveLoader: {
    modules: ['node_modules', resolve(__dirname, './lib/loader')]
  }
}

export default config

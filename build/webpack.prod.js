const path = require('path')
// 合并配置文件
const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')
// 压缩CSS插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// 压缩CSS和JS代码
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { createCssLoader } = require('./utils')
var plugins = [
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[name].[contenthash].css'
  })
  /* new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info',
    }) */
]

module.exports = merge(common, {
  optimization: {
    emitOnErrors: true, //  在编译时每当有错误时，就会 emit asset
    // 分离chunks
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    },
    minimize: false, // 是否压缩
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            drop_debugger: true
            // drop_console: true,
          }
        },
        cache: true, // 开启缓存
        parallel: true, // 允许并发
        sourceMap: true // set to true if you want JS source maps
      }),
      new CssMinimizerPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: createCssLoader('scss', { modules: true, extract: true })
          },
          {
            test: /\.module\.\w+$/,
            use: createCssLoader('scss', { modules: true, extract: true })
          },
          {
            use: createCssLoader('scss', { extract: true })
          }
        ]
      },
      {
        test: /\.less$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: createCssLoader('less', { modules: true, extract: true })
          },
          {
            test: /\.module\.\w+$/,
            use: createCssLoader('less', { modules: true, extract: true })
          },
          {
            use: createCssLoader('less', { extract: true })
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset'
      }
    ]
  },
  plugins: plugins,
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    environment: {
      arrowFunction: false,
      destructuring: false
    },
    clean: true
  }
})

import { merge } from 'webpack-merge'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseWebpackConfig from './webpack.base'

export default merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: 'assets/[name].[contenthash].js',
    environment: {
      arrowFunction: false,
      destructuring: false
    },
    clean: true
  },
  optimization: {
    chunkIds: 'named',
    moduleIds: 'deterministic',
    runtimeChunk: true,
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
    minimize: true, // 是否压缩
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            pure_funcs: ['console.log'],
            drop_debugger: true
          },

          mangle: {
            safari10: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
      chunkFilename: 'assets/[name].[contenthash].css'
    }),
    ...(process.env.report
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
          })
        ]
      : [])
  ]
})

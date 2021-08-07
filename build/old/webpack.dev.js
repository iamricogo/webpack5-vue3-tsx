/*
 * @Author: Rico
 * @Date: 2021-08-02 14:51:29
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 19:33:27
 * @Description:
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')
const portfinder = require('portfinder')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const openInEditor = require('launch-editor-middleware')
const { getServerUrls } = require('./utils')
const devWebpackConfig = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  cache: {
    type: 'filesystem'
  },
  devServer: {
    before(app) {
      app.use('/__open-in-editor', openInEditor())
    },
    contentBase: '../dist',
    host: '0.0.0.0',
    overlay: true,
    stats: 'errors-only',
    compress: true, // 为每个静态文件开启 gzip compression
    useLocalIp: true,
    quiet: true,
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }]
    }
  }
})
module.exports = async () => {
  portfinder.basePort = process.env.PORT || '8080'
  const host = devWebpackConfig.devServer.host
  const port = await portfinder.getPortPromise()
  devWebpackConfig.devServer.port = process.env.PORT = port

  const friendlyErrors = new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [getServerUrls(host, port)]
    }
  })

  if (devWebpackConfig.plugins) {
    devWebpackConfig.plugins.push(friendlyErrors)
  } else {
    devWebpackConfig.plugins = [friendlyErrors]
  }
  return devWebpackConfig
}

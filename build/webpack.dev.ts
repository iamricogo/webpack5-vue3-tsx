import { Configuration, WebpackOptionsNormalized } from 'webpack'
import { getPortPromise } from 'portfinder'
import { getServerUrls } from './utils'
import { merge } from 'webpack-merge'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import baseWebpackConfig from './webpack.base'
import openInEditor from 'launch-editor-middleware'
interface DevServerConfiguration extends Configuration {
  devServer?: WebpackOptionsNormalized['devServer']
}

const config = async (): Promise<DevServerConfiguration> => {
  const host = process.env.HOST || '0.0.0.0'
  const port = await getPortPromise({ port: Number(process.env.PORT) || 8080 })

  return merge<DevServerConfiguration>(baseWebpackConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    cache: {
      type: 'filesystem'
    },
    devServer: {
      contentBase: '../dist',
      host,
      port,
      overlay: true,
      stats: 'errors-only',
      compress: true, // 为每个静态文件开启 gzip compression
      useLocalIp: true,
      quiet: true,
      historyApiFallback: {
        rewrites: [{ from: /./, to: '/index.html' }]
      },
      before(app) {
        app.use('/__open-in-editor', openInEditor())
      }
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [getServerUrls(host, port)]
        }
      })
    ]
  })
}

export default config

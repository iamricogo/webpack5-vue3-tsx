const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const os = require('os')
const chalk = require('chalk')

exports._typeof = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
/**
 * @param {string} key 
 *  can't find    =>undefined
        --key         =>true
        --key=value   =>value
        --key value   =>value
 * @returns 
 */
exports.getArgvByKey = (key) => {
  let value = undefined
  for (let index = 0; index < process.argv.length; index++) {
    const cur = process.argv[index],
      next = process.argv[index + 1]
    if (new RegExp(`^--${key}(=\\w+)?$`).test(cur)) {
      if (new RegExp(`^--${key}$`).test(cur)) {
        //--key value
        value = !next || (next && new RegExp(`^--\\w+(=\\w+)?$`).test(next)) ? true : next
      } else {
        //--key=value
        value = cur.split('=')[1]
      }
      break
    }
  }
  return value
}

exports.isDev = () => process.env.NODE_ENV === 'development'

/**
 *
 * @param {'scss'|'less'|Object} loaderName
 * @param {*} options
 * @returns
 */
exports.createCssLoader = (loaderName = 'scss', options = {}) => {
  const { modules, extract } = Object.assign({ modules: false, extract: !exports.isDev() }, options)
  const preLoader = {
    less: {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true
        },
        modifyVars: {
          hack: `true;`
        }
      }
    },
    scss: 'sass-loader'
  }

  const loaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: modules
          ? Object.assign(
              {
                localIdentName: '[name]-[local]-[hash:base64:5]'
              },
              exports._typeof(modules) === 'object' ? modules : {}
            )
          : false
      }
    },
    'postcss-loader',
    typeof loaderName === 'string' ? preLoader[loaderName] : loaderName
  ]

  modules && loaders.unshift('css-modules-typescript-loader')

  loaders.unshift(
    extract
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: Object.assign(
            {
              publicPath: '../'
            },
            exports._typeof(extract) === 'object' ? extract : {}
          )
        }
      : 'style-loader'
  )

  return loaders
}

exports.printServerUrls = (host, port) =>
  chalk.cyan(`Webpack`) +
  chalk.green(
    ` dev server running at:\n${Object.values(os.networkInterfaces())
      .flatMap((nInterface) => nInterface ?? [])
      .filter((detail) => detail.family === 'IPv4')
      .filter((detail) => (host === '0.0.0.0' ? true : detail.address.includes('127.0.0.1')))
      .sort((a, b) => {
        const aIsLocal = a.address.includes('127.0.0.1')
        const bIsLocal = b.address.includes('127.0.0.1')
        if (aIsLocal && !bIsLocal) {
          return -1
        }
        if (!aIsLocal && bIsLocal) {
          return -1
        }
        return 0
      })
      .map((detail) => {
        const type = detail.address.includes('127.0.0.1') ? 'Local:   ' : 'Network: '
        const host = detail.address.replace('127.0.0.1', 'localhost')
        const url = `http://${host}:${chalk.bold(port)}`
        return `  > ${type} ${chalk.cyan(url)}`
      })
      .join(`\n`)}`
  )
